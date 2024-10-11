import { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { EnterEmail } from "./EnterEmail";
import { EnterVerificationCode } from "./EnterCode";
import { EnterPassword } from "./LoginWithPassword";
import { UsePasskey } from "./LoginWithPasskey";
import { storage } from "@/lib/storage";
import { loginUser } from "@/lib/auth";

type LoginStep = "email" | "verification" | "password" | "passkey";

interface LoginFlowProps {
  email: string;
  setEmail: (email: string) => void;
}

export const LoginFlow: React.FC<LoginFlowProps> = ({ email, setEmail }) => {
  const [step, setStep] = useState<LoginStep>("email");
  const [verificationCode, setVerificationCode] = useState("");
  const router = useRouter();

  const handleEmailSubmit = async (email: string) => {
    // TODO: Implement email verification request
    setEmail(email);
    setStep("verification");
  };

  const handleVerificationSubmit = async (code: string) => {
    setVerificationCode(code);
    // TODO: Verify the code and check if the user has a password or passkey
    const hasPassword = true; // Replace with actual check
    setStep(hasPassword ? "password" : "passkey");
  };

  const handlePasswordSubmit = async (password: string) => {
    try {
      const response = await loginUser(email, password);
      if (response.success) {
        await storage.setSession(response.session);
        await storage.setUser(response.user);
        toast.success("Login successful!");
        router.push("/");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login. Please try again.");
    }
  };

  const handlePasskeySubmit = async () => {
    // TODO: Implement passkey authentication
    toast.success("Passkey authentication successful!");
    router.push("/");
  };

  return (
    <div>
      {step === "email" && <EnterEmail onSubmit={handleEmailSubmit} />}
      {step === "verification" && (
        <EnterVerificationCode onSubmit={handleVerificationSubmit} />
      )}
      {step === "password" && <EnterPassword onSubmit={handlePasswordSubmit} />}
      {step === "passkey" && <UsePasskey onSubmit={handlePasskeySubmit} />}
    </div>
  );
};
