import React from "react";
import { toast } from "sonner";
import { startRegistration } from "@simplewebauthn/browser";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { AppButton } from "@/components/ui/Button";
import { RegisterHeader } from "./RegisterHeader";
import { AppCopy } from "@/components/ui/AppCopy";

interface RegisterWithPasskeyProps {
  chipIssuer: string | null;
  username: string;
  onPasskeyRegister: (password: string, authPublicKey: string) => Promise<void>;
  onSwitchToPassword: () => void;
}

const RegisterWithPasskey: React.FC<RegisterWithPasskeyProps> = ({
  chipIssuer,
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
      toast.error("Authentication failed! Please try again.");
      return;
    }
  };

  return (
    <div className="space-y-6">
      {chipIssuer && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Registering chip issued by: {chipIssuer}
        </p>
      )}
      <RegisterHeader
        title={
          <span className="font-sans text-center text-[30px] leading-[30px] font-semibold text-primary tracking-[-0.22px]">
            Welcome, <br /> {`${username || "placeholder"}!`}
          </span>
        }
        subtitle="Get started wielding your data"
        description="We only host encrypted backups of your data and cannot see the contents."
      />
      <div className="flex flex-col space-y-3">
        <AppButton onClick={handlePasskeyRegistration}>
          Register with passkey
        </AppButton>
        <span className="text-quaternary text-center text-sm font-sans ">
          or
        </span>
        <AppButton onClick={onSwitchToPassword} variant="outline">
          Choose a password
        </AppButton>
      </div>
      <AppCopy className=" mt-auto mx-auto absolute bottom-5 text-center justify-center left-1/2 -translate-x-1/2" />
    </div>
  );
};

export default RegisterWithPasskey;
