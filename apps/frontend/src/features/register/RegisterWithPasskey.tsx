import React from "react";
import { toast } from "sonner";
import { startRegistration } from "@simplewebauthn/browser";
import { generateRegistrationOptions } from "@simplewebauthn/server";

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
      <div className="space-y-4">
        <button
          onClick={handlePasskeyRegistration}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          Register with passkey
        </button>
        <button
          onClick={onSwitchToPassword}
          className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          Choose a password
        </button>
      </div>
    </div>
  );
};

export default RegisterWithPasskey;
