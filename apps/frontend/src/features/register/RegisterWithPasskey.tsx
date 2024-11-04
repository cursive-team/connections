import React from "react";
import { toast } from "sonner";
import { startRegistration } from "@simplewebauthn/browser";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { AppButton } from "@/components/ui/Button";
import { RegisterHeader } from "./RegisterHeader";
import { AppCopy } from "@/components/ui/AppCopy";
import { SupportToast } from "@/components/ui/SupportToast";
import { errorToString } from "@types";
import { ERROR_SUPPORT_CONTACT } from "@/constants";

interface RegisterWithPasskeyProps {
  username: string;
  onPasskeyRegister: (password: string, authPublicKey: string) => Promise<void>;
  onSwitchToPassword: () => void;
}

const RegisterWithPasskey: React.FC<RegisterWithPasskeyProps> = ({
  username,
  onPasskeyRegister,
  onSwitchToPassword,
}) => {
  const handlePasskeyRegistration = async () => {
    const registrationOptions = await generateRegistrationOptions({
      rpName: "cursive-connections",
      rpID: window.location.hostname,
      userID: new TextEncoder().encode(username),
      userName: username,
      attestationType: "none",
    });

    try {
      const { id, response: authResponse } = await startRegistration(
        registrationOptions
      );
      const authPublicKey = authResponse.publicKey;
      if (!authPublicKey) {
        throw new Error("No public key returned from authenticator");
      }

      await onPasskeyRegister(id, authPublicKey);
    } catch (error) {
      console.error("Error creating account: ", error);
      toast(
        SupportToast(
          "",
          true,
          "Authentication failed! Please try again.",
          ERROR_SUPPORT_CONTACT,
          errorToString(error)
        )
      );
      return;
    }
  };

  return (
    <div className="flex flex-col grow">
      <RegisterHeader
        title={`Finish securing your account`}
        description="A passkey or password is used to securely encrypt your data as a backup. 
        No further data you add will be stored on our servers."
      />

      <div className="flex flex-col mt-auto">
        <div className="flex flex-col space-y-3 pb-2">
          <AppButton onClick={handlePasskeyRegistration}>
            Secure with passkey
          </AppButton>
          <span className="text-label-quaternary text-center text-sm font-sans ">
            or
          </span>
          <AppButton onClick={onSwitchToPassword} variant="outline">
            Secure with password
          </AppButton>
        </div>
        <AppCopy className="text-center py-4" />
      </div>
    </div>
  );
};

export default RegisterWithPasskey;
