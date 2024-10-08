import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { storage } from "@/lib/storage";
import { Json, UsernameSchema } from "@types";
import EnterEmail from "@/features/register/EnterEmail";
import EnterCode from "@/features/register/EnterCode";
import EnterUserInfo from "@/features/register/EnterUserInfo";
import RegisterWithPasskey from "@/features/register/RegisterWithPasskey";
import RegisterWithPassword from "@/features/register/RegisterWithPassword";
import CreatingAccount from "@/features/register/CreatingAccount";
import Image from "next/image";

import LannaDiscoverConnections from "@/features/register/LannaDiscoverConnections";
import {
  requestSigninToken,
  verifyEmailIsUnique,
  verifySigninToken,
  verifyUsernameIsUnique,
} from "@/lib/auth/util";
import { LannaDesiredConnections, TapInfo } from "@/lib/storage/types";
import { AppCopy } from "@/components/ui/AppCopy";
import { registerChip } from "@/lib/chip/register";
import { registerUser } from "@/lib/auth/register";

enum DisplayState {
  ENTER_EMAIL,
  ENTER_CODE,
  ENTER_USER_INFO,
  REGISTER_WITH_PASSKEY,
  REGISTER_WITH_PASSWORD,
  CREATING_ACCOUNT,
  LANNA_DISCOVER_CONNECTIONS,
}

const Register: React.FC = () => {
  const router = useRouter();
  const [displayState, setDisplayState] = useState<DisplayState>(
    DisplayState.ENTER_EMAIL
  );
  const [attemptedToLoadSavedTap, setAttemptedToLoadSavedTap] = useState(false);
  const [savedTap, setSavedTap] = useState<TapInfo | null>(null);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [telegramHandle, setTelegramHandle] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [backupPassword, setBackupPassword] = useState("");
  const [authPublicKey, setAuthPublicKey] = useState<string | null>(null);
  const [registeredWithPasskey, setRegisteredWithPasskey] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    const loadSavedTap = async () => {
      const tap = await storage.loadSavedTapInfo();
      if (!tap) {
        // TODO: Enable registration without a saved tap
        toast.error("No saved tap found!");
        router.push("/");
      } else {
        if (tap.tapResponse.chipIsRegistered) {
          toast.error("Chip is already registered!");
          router.push("/");
        }

        await storage.deleteSavedTapInfo();
        setSavedTap(tap);
      }
      setAttemptedToLoadSavedTap(true);
    };
    loadSavedTap();
  }, [router]);

  const handleEmailSubmit = async (submittedEmail: string) => {
    const isUnique = await verifyEmailIsUnique(submittedEmail);
    if (!isUnique) {
      toast.error("Email is already in use");
      return;
    }

    try {
      await requestSigninToken(submittedEmail);
    } catch (error) {
      console.error(error);
      toast.error("Error requesting signin token");
      return;
    }

    setEmail(submittedEmail);
    setDisplayState(DisplayState.ENTER_CODE);
  };

  const handleCodeSubmit = async (submittedCode: string) => {
    const isValid = await verifySigninToken(email, submittedCode);
    if (!isValid) {
      toast.error("Invalid code");
      return;
    }

    setCode(submittedCode);
    setDisplayState(DisplayState.ENTER_USER_INFO);
  };

  const handleUserInfoSubmit = async (userInfo: {
    username: string;
    displayName: string;
    bio: string;
    telegramHandle: string;
    twitterHandle: string;
  }) => {
    const parsedUsername = UsernameSchema.parse(userInfo.username);
    const usernameIsUnique = await verifyUsernameIsUnique(parsedUsername);
    if (!usernameIsUnique) {
      toast.error("Username is already taken");
      return;
    }

    setUsername(parsedUsername);
    setDisplayName(userInfo.displayName);
    setBio(userInfo.bio);
    setTelegramHandle(userInfo.telegramHandle);
    setTwitterHandle(userInfo.twitterHandle);
    setDisplayState(DisplayState.REGISTER_WITH_PASSKEY);
  };

  const handleSwitchToRegisterWithPassword = () => {
    setDisplayState(DisplayState.REGISTER_WITH_PASSWORD);
  };

  const handleRegisterWithPasskey = async (
    password: string,
    authPublicKey: string
  ) => {
    setBackupPassword(password);
    setRegisteredWithPasskey(true);
    setAuthPublicKey(authPublicKey);
    await handleCreateAccount();
  };

  const handleSwitchToRegisterWithPasskey = () => {
    setDisplayState(DisplayState.REGISTER_WITH_PASSKEY);
  };

  const handleRegisterWithPassword = async (password: string) => {
    setBackupPassword(password);
    setRegisteredWithPasskey(false);
    await handleCreateAccount();
  };

  const handleCreateAccount = async () => {
    setDisplayState(DisplayState.CREATING_ACCOUNT);
    try {
      // Register user
      await registerUser({
        signinToken: code,
        email,
        password: backupPassword,
        username,
        displayName,
        bio,
        telegramHandle,
        twitterHandle,
        registeredWithPasskey: registeredWithPasskey || false,
        passkeyAuthPublicKey: authPublicKey || undefined,
      });

      const user = await storage.getUser();
      const session = await storage.getSession();
      if (!user || !session) {
        toast.error("Error creating account! Please try again.");
        return;
      }

      // Register chip if saved tap is present
      if (savedTap) {
        const {
          username,
          displayName,
          bio,
          signaturePublicKey,
          encryptionPublicKey,
          psiPublicKeyLink,
        } = user.userData;

        // Set owner user data for chip registration
        // TODO: Generalize this to be extensible for arbitrary user data
        const ownerUserData: Json = {};
        if (user.userData.twitter && user.userData.twitter.username) {
          ownerUserData.twitter = {
            username: user.userData.twitter.username,
          };
        }
        if (user.userData.telegram && user.userData.telegram.username) {
          ownerUserData.telegram = {
            username: user.userData.telegram.username,
          };
        }

        await registerChip({
          authToken: session.authTokenValue,
          tapParams: savedTap.tapParams,
          ownerUsername: username,
          ownerDisplayName: displayName,
          ownerBio: bio,
          ownerSignaturePublicKey: signaturePublicKey,
          ownerEncryptionPublicKey: encryptionPublicKey,
          ownerPsiPublicKeyLink: psiPublicKeyLink,
          ownerUserData,
        });

        // If user is registering with a chip, continue onboarding
        // TODO: Only do this for Lanna chips
        setDisplayState(DisplayState.LANNA_DISCOVER_CONNECTIONS);
        return;
      }

      // Show success toast and redirect to home
      toast.success("Account created successfully!");
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create account. Please try again");
      router.push("/");
      return;
    }
  };

  const handleLannaDiscoverConnectionsSubmit = async (
    desiredConnections: LannaDesiredConnections
  ) => {
    const user = await storage.getUser();
    if (!user) {
      toast.error("User not found");
      return;
    }

    await storage.updateUserData({
      ...user.userData,
      lanna: { desiredConnections },
    });
    toast.success("Successfully created your account!");
    router.push("/profile");
  };

  if (!attemptedToLoadSavedTap) {
    return null;
  }

  const chipIssuer = savedTap?.tapResponse.chipIssuer ?? null;
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-12 sm:px-6 lg:px-8">
      {[
        DisplayState.ENTER_EMAIL,
        DisplayState.ENTER_CODE,
        DisplayState.REGISTER_WITH_PASSKEY,
        DisplayState.REGISTER_WITH_PASSWORD,
        DisplayState.CREATING_ACCOUNT,
        DisplayState.LANNA_DISCOVER_CONNECTIONS,
      ].includes(displayState) && (
        <div className="h-[200px] w-full top-0">
          <Image
            src="/images/register-main.svg"
            alt="register main"
            layout="responsive"
            className=" object-cover"
            sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
            width={100}
            height={375}
          />
        </div>
      )}

      <div className="container mt-16 sm:mx-auto sm:w-full sm:max-w-md">
        {displayState === DisplayState.ENTER_EMAIL && (
          <EnterEmail chipIssuer={chipIssuer} submitEmail={handleEmailSubmit} />
        )}
        {displayState === DisplayState.ENTER_CODE && (
          <EnterCode
            chipIssuer={chipIssuer}
            email={email}
            submitCode={handleCodeSubmit}
          />
        )}
        {displayState === DisplayState.ENTER_USER_INFO && (
          <EnterUserInfo
            chipIssuer={chipIssuer}
            onSubmit={handleUserInfoSubmit}
          />
        )}
        {displayState === DisplayState.REGISTER_WITH_PASSKEY && (
          <RegisterWithPasskey
            chipIssuer={chipIssuer}
            username={username}
            onPasskeyRegister={handleRegisterWithPasskey}
            onSwitchToPassword={handleSwitchToRegisterWithPassword}
          />
        )}
        {displayState === DisplayState.REGISTER_WITH_PASSWORD && (
          <RegisterWithPassword
            chipIssuer={chipIssuer}
            onSubmit={handleRegisterWithPassword}
            onSwitchToPasskey={handleSwitchToRegisterWithPasskey}
          />
        )}
        {displayState === DisplayState.CREATING_ACCOUNT && <CreatingAccount />}
        {displayState === DisplayState.LANNA_DISCOVER_CONNECTIONS && (
          <LannaDiscoverConnections
            onSubmit={handleLannaDiscoverConnectionsSubmit}
          />
        )}
      </div>
      <AppCopy className="mt-auto mx-auto absolute bottom-5 text-center justify-center left-1/2 -translate-x-1/2" />
    </div>
  );
};

export default Register;
