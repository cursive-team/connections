import React, { useEffect, useState } from "react";
import { registerUser } from "@/lib/auth/register";
import { toast } from "sonner";

interface CreatingAccountProps {
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
