"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { storage } from "@/lib/storage";
import { errorToString, Json, UsernameSchema } from "@types";
import EnterUsername from "@/features/register/devcon/EnterUsername";
import EnterUserInfo from "@/features/register/devcon/EnterUserInfo";
import RegisterWithPasskey from "@/features/register/devcon/RegisterWithPasskey";
import RegisterWithPassword from "@/features/register/devcon/RegisterWithPassword";
import { verifyUsernameIsUnique } from "@/lib/auth/util";
import { TapInfo } from "@/lib/storage/types";
import { registerChip } from "@/lib/chip/register";
import { applyBackupsToNewUser, registerUser } from "@/lib/auth/register";
import useSettings from "@/hooks/useSettings";
import { HeaderCover } from "@/components/ui/HeaderCover";
import { logClientEvent } from "@/lib/frontend/metrics";
import { cn } from "@/lib/frontend/util";
import { IoIosArrowBack as BackIcon } from "react-icons/io";
import { SupportToast } from "@/components/ui/SupportToast";
import { ERROR_SUPPORT_CONTACT } from "@/constants";
import { zxcvbn } from "@zxcvbn-ts/core";

enum DisplayState {
  ENTER_USERNAME,
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
    DisplayState.ENTER_USERNAME
  );
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [telegramHandle, setTelegramHandle] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const { darkTheme } = useSettings();

  const handleUsernameSubmit = async (username: string) => {
    logClientEvent("register-username-submit", {
      chipIssuer: savedTap.tapResponse.chipIssuer,
    });
    const parsedUsername = UsernameSchema.parse(username);
    const usernameIsUnique = await verifyUsernameIsUnique(parsedUsername);
    if (!usernameIsUnique) {
      toast.error("Username is already taken");
      return;
    }
    setUsername(parsedUsername);

    setDisplayState(DisplayState.ENTER_USER_INFO);
  };

  const handleUserInfoSubmit = async (userInfo: {
    displayName: string;
    bio: string;
    telegramHandle: string;
    twitterHandle: string;
  }) => {
    logClientEvent("register-user-info-submit", {
      chipIssuer: savedTap.tapResponse.chipIssuer,
    });

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

    // setDisplayState(DisplayState.CREATING_ACCOUNT);
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
      await applyBackupsToNewUser(backupPassword);

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
    if (
      displayState === DisplayState.REGISTER_WITH_PASSKEY ||
      displayState === DisplayState.REGISTER_WITH_PASSWORD
    ) {
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
        DisplayState.REGISTER_WITH_PASSWORD,
        DisplayState.REGISTER_WITH_PASSKEY,
      ].includes(displayState) && (
        <div
          className={cn(
            "hidden", // back button not needed for now
            "flex px-3 justify-between border-b  w-full backdrop-blur-md top-0 z-50 items-center h-[50px] xs:h-[60px] bg-background",
            darkTheme ? "border-b-white/20" : "border-b-black"
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
        DisplayState.ENTER_USERNAME,
        DisplayState.REGISTER_WITH_PASSKEY,
        DisplayState.REGISTER_WITH_PASSWORD,
        DisplayState.CREATING_ACCOUNT,
      ].includes(displayState) && (
        <HeaderCover
          image="devcon"
          // isLoading={[DisplayState.CREATING_ACCOUNT].includes(displayState)}
          isLoading={isCreatingAccount}
        />
      )}
      <div className="flex-grow flex px-6 center sm:mx-auto sm:w-full sm:max-w-md">
        {displayState === DisplayState.ENTER_USERNAME && (
          <EnterUsername submitUsername={handleUsernameSubmit} />
        )}
        {displayState === DisplayState.ENTER_USER_INFO && (
          <EnterUserInfo
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
        {/* {displayState === DisplayState.CREATING_ACCOUNT && <CreatingAccount />} */}
      </div>
    </div>
  );
};

export default RegisterDevcon;
