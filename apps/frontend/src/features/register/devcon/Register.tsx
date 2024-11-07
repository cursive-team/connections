"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { storage } from "@/lib/storage";
import { errorToString, Json, UsernameSchema } from "@types";
import EnterEmail from "@/features/register/devcon/EnterEmail";
import EnterCode from "@/features/register/devcon/EnterCode";
import EnterUserInfo from "@/features/register/devcon/EnterUserInfo";
import RegisterWithPasskey from "@/features/register/devcon/RegisterWithPasskey";
import RegisterWithPassword from "@/features/register/devcon/RegisterWithPassword";
import CreatingAccount from "@/features/register/devcon/CreatingAccount";
import {
  requestSigninToken,
  verifyEmailIsUnique,
  verifySigninToken,
  verifyUsernameIsUnique,
} from "@/lib/auth/util";
import { TapInfo } from "@/lib/storage/types";
import { registerChip } from "@/lib/chip/register";
import { registerUser } from "@/lib/auth/register";
import useSettings from "@/hooks/useSettings";
import { HeaderCover } from "@/components/ui/HeaderCover";
import { logClientEvent } from "@/lib/frontend/metrics";
import { cn } from "@/lib/frontend/util";
import { IoIosArrowBack as BackIcon } from "react-icons/io";
import { SupportToast } from "@/components/ui/SupportToast";
import { ERROR_SUPPORT_CONTACT } from "@/constants";
import { zxcvbn } from "@zxcvbn-ts/core";

enum DisplayState {
  ENTER_EMAIL,
  ENTER_CODE,
  ENTER_USER_INFO,
  REGISTER_WITH_PASSKEY,
  REGISTER_WITH_PASSWORD,
  CREATING_ACCOUNT,
}

interface RegisterDevconProps {
  savedTap: TapInfo;
}

const RegisterDevcon: React.FC<RegisterDevconProps> = ({ savedTap }) => {
  const router = useRouter();
  const { pageHeight } = useSettings();
  const [displayState, setDisplayState] = useState<DisplayState>(
    DisplayState.ENTER_EMAIL
  );
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [telegramHandle, setTelegramHandle] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");

  const handleEmailSubmit = async (submittedEmail: string) => {
    logClientEvent("register-email-submit", {
      chipIssuer: savedTap.tapResponse.chipIssuer,
    });
    const isUnique = await verifyEmailIsUnique(submittedEmail);
    if (!isUnique) {
      toast.error("Email is already in use");
      return;
    }

    try {
      await requestSigninToken(submittedEmail);
    } catch (error) {
      console.error(error);
      toast(
        SupportToast(
          "",
          true,
          "Error requesting signin token",
          ERROR_SUPPORT_CONTACT,
          errorToString(error)
        )
      );
      return;
    }

    setEmail(submittedEmail);
    setDisplayState(DisplayState.ENTER_CODE);
  };

  const handleCodeSubmit = async (submittedCode: string) => {
    logClientEvent("register-code-submit", {
      chipIssuer: savedTap.tapResponse.chipIssuer,
    });
    try {
      const isValid = await verifySigninToken(email, submittedCode);
      if (!isValid) {
        toast.error("Invalid code");
        return;
      }

      setCode(submittedCode);
      setDisplayState(DisplayState.ENTER_USER_INFO);
    } catch (error) {
      toast(
        SupportToast(
          "",
          true,
          "Cannot verify signin code",
          ERROR_SUPPORT_CONTACT,
          errorToString(error)
        )
      );
      return;
    }
  };

  const handleUserInfoSubmit = async (userInfo: {
    username: string;
    displayName: string;
    bio: string;
    telegramHandle: string;
    twitterHandle: string;
  }) => {
    logClientEvent("register-user-info-submit", {
      chipIssuer: savedTap.tapResponse.chipIssuer,
    });
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
    logClientEvent("register-switch-to-register-with-password", {
      chipIssuer: savedTap.tapResponse.chipIssuer,
    });
    setDisplayState(DisplayState.REGISTER_WITH_PASSWORD);
  };

  const handleRegisterWithPasskey = async (
    password: string,
    authPublicKey: string
  ) => {
    logClientEvent("register-register-with-passkey", {
      chipIssuer: savedTap.tapResponse.chipIssuer,
    });
    await handleCreateAccount(password, true, authPublicKey);
  };

  const handleSwitchToRegisterWithPasskey = () => {
    logClientEvent("register-switch-to-register-with-passkey", {
      chipIssuer: savedTap.tapResponse.chipIssuer,
    });
    setDisplayState(DisplayState.REGISTER_WITH_PASSKEY);
  };

  const handleRegisterWithPassword = async (password: string) => {
    // Check password strength
    const passwordCheck = zxcvbn(password);

    // 3 # safely unguessable: moderate protection from offline slow-hash scenario. (guesses < 10^10)
    // https://github.com/dropbox/zxcvbn/blob/master/README.md
    if (passwordCheck && passwordCheck.score < 3) {
      toast.error(
        "Weak password, try adding numbers, symbols, and using less common words."
      );
      return;
    }

    logClientEvent("register-register-with-password", {
      chipIssuer: savedTap.tapResponse.chipIssuer,
    });
    await handleCreateAccount(password, false, undefined);
  };

  const handleCreateAccount = async (
    backupPassword: string,
    registeredWithPasskey: boolean,
    authPublicKey: string | undefined
  ) => {
    logClientEvent("register-create-account", {
      chipIssuer: savedTap.tapResponse.chipIssuer,
    });
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
        registeredWithPasskey: registeredWithPasskey,
        passkeyAuthPublicKey: authPublicKey,
      });

      const { user, session } = await storage.getUserAndSession();

      // Register chip if saved tap is present
      if (savedTap) {
        logClientEvent("register-register-chip", {
          chipIssuer: savedTap.tapResponse.chipIssuer,
        });
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
      }

      // Show success toast and redirect to home
      toast.success("Account created successfully!");
      router.push("/profile");
    } catch (error) {
      onGoBack();
      logClientEvent("register-create-account-error", {
        error: errorToString(error),
      });
      console.error(error);
      toast(
        SupportToast(
          "",
          true,
          "Failed to create account. Please try again",
          ERROR_SUPPORT_CONTACT,
          errorToString(error)
        )
      );
      return;
    }
  };

  const onGoBack = () => {
    if (displayState === DisplayState.ENTER_CODE) {
      setDisplayState(DisplayState.ENTER_EMAIL);
    }

    if (displayState === DisplayState.ENTER_CODE) {
      setDisplayState(DisplayState.ENTER_EMAIL);
    }

    if (
      displayState === DisplayState.REGISTER_WITH_PASSKEY ||
      displayState === DisplayState.REGISTER_WITH_PASSWORD
    ) {
      setDisplayState(DisplayState.ENTER_USER_INFO);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-100 flex flex-col"
      style={{
        minHeight: `${pageHeight}px`,
      }}
    >
      {[
        DisplayState.ENTER_CODE,
        DisplayState.REGISTER_WITH_PASSWORD,
        DisplayState.REGISTER_WITH_PASSKEY,
      ].includes(displayState) && (
        <div
          className={cn(
            "hidden", // back button not needed for now
            "flex px-3 justify-between border-b border-b-primary w-full backdrop-blur-md top-0 z-50 items-center h-[50px] xs:h-[60px] bg-white"
          )}
        >
          <button
            type="button"
            className="flex items-center gap-1 text-label-primary"
            onClick={() => {
              onGoBack?.();
            }}
          >
            <BackIcon />
            <span className="text-sm font-normal text-label-primary">
              {"Back"}
            </span>
          </button>
        </div>
      )}

      {[
        DisplayState.ENTER_EMAIL,
        DisplayState.ENTER_CODE,
        DisplayState.REGISTER_WITH_PASSKEY,
        DisplayState.REGISTER_WITH_PASSWORD,
        DisplayState.CREATING_ACCOUNT,
      ].includes(displayState) && (
        <HeaderCover
          image="edge-city"
          isLoading={[DisplayState.CREATING_ACCOUNT].includes(displayState)}
        />
      )}
      <div className="flex-grow flex px-6 center sm:mx-auto sm:w-full sm:max-w-md">
        {displayState === DisplayState.ENTER_EMAIL && (
          <EnterEmail defaultEmail={email} submitEmail={handleEmailSubmit} />
        )}
        {displayState === DisplayState.ENTER_CODE && (
          <EnterCode email={email} submitCode={handleCodeSubmit} />
        )}
        {displayState === DisplayState.ENTER_USER_INFO && (
          <EnterUserInfo
            username={username}
            displayName={displayName}
            bio={bio}
            telegramHandle={telegramHandle}
            twitterHandle={twitterHandle}
            onSubmit={handleUserInfoSubmit}
          />
        )}
        {displayState === DisplayState.REGISTER_WITH_PASSKEY && (
          <RegisterWithPasskey
            username={username}
            onPasskeyRegister={handleRegisterWithPasskey}
            onSwitchToPassword={handleSwitchToRegisterWithPassword}
          />
        )}
        {displayState === DisplayState.REGISTER_WITH_PASSWORD && (
          <RegisterWithPassword
            onSubmit={handleRegisterWithPassword}
            onSwitchToPasskey={handleSwitchToRegisterWithPasskey}
          />
        )}
        {displayState === DisplayState.CREATING_ACCOUNT && <CreatingAccount />}
      </div>
    </div>
  );
};

export default RegisterDevcon;
