import React from "react";
import { toast } from "sonner";
import { startAuthentication } from "@simplewebauthn/browser";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { AppButton } from "@/components/ui/Button";
import { RegisterHeader } from "@/features/register/RegisterHeader";
import { AppCopy } from "@/components/ui/AppCopy";
import { SupportToast } from "@/components/ui/SupportToast";
import { errorToString } from "@types";
import { ERROR_SUPPORT_CONTACT } from "@/constants";

interface LoginWithPasskeyProps {
  onPasskeyLogin: (password: string) => Promise<void>;
}

const LoginWithPasskey: React.FC<LoginWithPasskeyProps> = ({
  onPasskeyLogin,
}) => {
  const handlePasskeyAuthentication = async () => {
    const authenticationOptions = await generateAuthenticationOptions({
      rpID: window.location.hostname,
    });

    try {
      const { id } = await startAuthentication(authenticationOptions);

      await onPasskeyLogin(id);
    } catch (error) {
      console.error("Error logging in: ", error);
      toast(SupportToast("", true, "Authentication failed! Please try again", ERROR_SUPPORT_CONTACT, errorToString(error)));
      return;
    }
  };

  return (
    <div className="flex flex-col grow">
      <RegisterHeader title="Login to your account" />

      <div className="flex flex-col mt-auto">
        <div className="flex flex-col space-y-3 pb-2">
          <AppButton onClick={handlePasskeyAuthentication}>
            Login with passkey
          </AppButton>
        </div>
        <AppCopy className="text-center py-4" />
      </div>
    </div>
  );
};

export default LoginWithPasskey;
