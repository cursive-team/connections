import React, { useEffect, useState } from "react";
import { registerUser } from "@/lib/auth/register";
import { toast } from "sonner";
import { storage } from "@/lib/storage";
import { registerChip } from "@/lib/chip/register";
import { Json } from "@types";
import { TapInfo } from "@/lib/storage/types";

interface CreatingAccountProps {
  savedTap: TapInfo | null;
  signinToken: string;
  email: string;
  password: string;
  username: string;
  displayName: string;
  bio: string;
  telegramHandle?: string;
  twitterHandle?: string;
  registeredWithPasskey: boolean | null;
  passkeyAuthPublicKey: string | null;
  onAccountCreated: () => Promise<void>;
}

const CreatingAccount: React.FC<CreatingAccountProps> = ({
  savedTap,
  signinToken,
  email,
  password,
  username,
  displayName,
  bio,
  telegramHandle,
  twitterHandle,
  registeredWithPasskey,
  passkeyAuthPublicKey,
  onAccountCreated,
}) => {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  useEffect(() => {
    const createAccount = async () => {
      try {
        await registerUser({
          signinToken,
          email,
          password,
          username,
          displayName,
          bio,
          telegramHandle,
          twitterHandle,
          registeredWithPasskey: registeredWithPasskey || false,
          passkeyAuthPublicKey: passkeyAuthPublicKey || undefined,
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
        }

        setIsCreatingAccount(false);
        await onAccountCreated();
      } catch (error) {
        toast.error(`Failed to create account: ${error}`);
      }
    };

    if (!isCreatingAccount) {
      setIsCreatingAccount(true);
      createAccount();
    }
  }, [isCreatingAccount]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        Creating Your Account
      </h2>
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      <p className="text-gray-600 dark:text-gray-400">
        Please wait while we set up your account...
      </p>
    </div>
  );
};

export default CreatingAccount;
