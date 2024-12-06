"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { storage } from "@/lib/storage";
import { errorToString, Json, UsernameSchema } from "@types";
import EnterUserInfo from "@/features/register/ethindia/EnterUserInfo";
import RegisterWithPassword from "@/features/register/ethindia/RegisterWithPassword";
import { verifyUsernameIsUnique } from "@/lib/auth/util";
import { TapInfo } from "@/lib/storage/types";
import { registerChip } from "@/lib/chip/register";
import { applyBackupsToNewUser, registerUser } from "@/lib/auth/register";
import useSettings from "@/hooks/useSettings";
import { HeaderCover } from "@/components/ui/HeaderCover";
import { logClientEvent } from "@/lib/frontend/metrics";
import { SupportToast } from "@/components/ui/SupportToast";
import { ERROR_SUPPORT_CONTACT } from "@/constants";
import { zxcvbn } from "@zxcvbn-ts/core";
import CreatingAccount from "./CreatingAccount";

enum DisplayState {
  ENTER_USER_INFO,
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
    DisplayState.ENTER_USER_INFO
  );
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [telegramHandle, setTelegramHandle] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

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
    setDisplayState(DisplayState.REGISTER_WITH_PASSWORD);
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
    setIsCreatingAccount(true);
    try {
      await registerUser({
        email: username,
        password: backupPassword,
        username,
        displayName,
        bio,
        telegramHandle,
        twitterHandle,
        registeredWithPasskey: registeredWithPasskey,
        passkeyAuthPublicKey: authPublicKey,
      });

      // This is the only place this method should be applied
      // Backups will only be applied if an unregistered user exists (which will only happen if an accountless client
      // goes through the tap flow)
      await applyBackupsToNewUser(
        backupPassword,
        savedTap.tapResponse.chipIssuer
      );

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

      setIsCreatingAccount(false);
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

  const handleFinishCreatingAccount = () => {
    // Show success toast and redirect to home
    toast.success("Account created successfully!");
    router.push("/profile");
  };

  const onGoBack = () => {
    if (displayState === DisplayState.REGISTER_WITH_PASSWORD) {
      setDisplayState(DisplayState.ENTER_USER_INFO);
    }
  };

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      style={{
        minHeight: `${pageHeight}px`,
      }}
    >
      {[
        DisplayState.ENTER_USER_INFO,
        DisplayState.REGISTER_WITH_PASSWORD,
        DisplayState.CREATING_ACCOUNT,
      ].includes(displayState) && (
        <HeaderCover
          image="ethindia"
          // isLoading={[DisplayState.CREATING_ACCOUNT].includes(displayState)}
          isLoading={isCreatingAccount}
        />
      )}
      <div className="flex-grow flex px-6 center sm:mx-auto sm:w-full sm:max-w-md">
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
        {displayState === DisplayState.REGISTER_WITH_PASSWORD && (
          <RegisterWithPassword
            onSubmit={handleRegisterWithPassword}
            onGoBack={onGoBack}
          />
        )}
        {displayState === DisplayState.CREATING_ACCOUNT && (
          <CreatingAccount
            isCreatingAccount={isCreatingAccount}
            handleFinishCreatingAccount={handleFinishCreatingAccount}
          />
        )}
      </div>
    </div>
  );
};

export default RegisterDevcon;
