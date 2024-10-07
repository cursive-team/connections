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

import {
  requestSigninToken,
  verifyEmailIsUnique,
  verifySigninToken,
  verifyUsernameIsUnique,
} from "@/lib/auth/util";
import { TapInfo } from "@/lib/storage/types";
import { registerChip } from "@/lib/chip/register";

enum DisplayState {
  ENTER_EMAIL,
  ENTER_CODE,
  ENTER_USER_INFO,
  REGISTER_WITH_PASSKEY,
  REGISTER_WITH_PASSWORD,
  CREATING_ACCOUNT,
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
    setDisplayState(DisplayState.CREATING_ACCOUNT);
  };

  const handleSwitchToRegisterWithPasskey = () => {
    setDisplayState(DisplayState.REGISTER_WITH_PASSKEY);
  };

  const handleRegisterWithPassword = async (password: string) => {
    setBackupPassword(password);
    setRegisteredWithPasskey(false);
    setDisplayState(DisplayState.CREATING_ACCOUNT);
  };

  const handleAccountCreated = async () => {
    const user = await storage.getUser();
    const session = await storage.getSession();
    if (!user || !session) {
      toast.error("Error creating account! Please try again.");
      return;
    }

    // Register edge city chip
    try {
      if (savedTap) {
        const {
          username,
          displayName,
          bio,
          signaturePublicKey,
          encryptionPublicKey,
          psiPublicKeyLink,
        } = user.userData;

        // Set owner user data
        // TODO: Generalize this to be extensible for arbitrary user data
        const ownerUserData: Json = {};
        if (user.userData.twitter && user.userData.twitter.username) {
          ownerUserData.twitter = { username: user.userData.twitter.username };
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
      }

      toast.success("Account created successfully!");
      router.push("/");
      return;
    } catch (error) {
      console.error(error);
      toast.error("Created account but failed to register chip.");
    }
  };

  if (!attemptedToLoadSavedTap) {
    return null;
  }

  const chipIssuer = savedTap?.tapResponse.chipIssuer ?? null;
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register for Cursive
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {displayState === DisplayState.ENTER_EMAIL && (
            <EnterEmail
              chipIssuer={chipIssuer}
              submitEmail={handleEmailSubmit}
            />
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
          {displayState === DisplayState.CREATING_ACCOUNT && (
            <CreatingAccount
              signinToken={code}
              email={email}
              password={backupPassword}
              username={username}
              displayName={displayName}
              bio={bio}
              telegramHandle={telegramHandle}
              twitterHandle={twitterHandle}
              registeredWithPasskey={registeredWithPasskey}
              passkeyAuthPublicKey={authPublicKey}
              onAccountCreated={handleAccountCreated}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
