import { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { EnterEmail } from "@/features/login/EnterEmail";
import { EnterCode } from "@/features/login/EnterCode";
import { EnterPassword } from "@/features/login/EnterPassword";
import { UsePasskey } from "@/features/login/UsePasskey";
import { storage } from "@/lib/storage";
import { loginUser, requestSigninToken } from "@/lib/auth";
import { HeaderCover } from "@/components/ui/HeaderCover";
import useSettings from "@/hooks/useSettings";

enum LoginState {
  EMAIL = "email",
  CODE = "code",
  PASSWORD = "password",
  PASSKEY = "passkey",
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { pageHeight } = useSettings();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<LoginState>(LoginState.EMAIL);
  const [code, setCode] = useState("");

  const handleEmailSubmit = async (submittedEmail: string) => {
    try {
      await requestSigninToken(submittedEmail);
    } catch (error) {
      console.error(error);
      toast.error("Error requesting signin token");
      return;
    }

    setEmail(submittedEmail);
    setStep(LoginState.CODE);
  };

  const handleCodeSubmit = async (submittedCode: string) => {
    // TODO: Verify the code and check if the user has a password or passkey
    const hasPassword = true; // Replace with actual check

    setCode(submittedCode);
    setStep(hasPassword ? LoginState.PASSWORD : LoginState.PASSKEY);
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
    <div
      className="min-h-screen bg-gray-100 flex flex-col"
      style={{
        minHeight: `${pageHeight}px`,
      }}
    >
      {[
        LoginState.EMAIL,
        LoginState.CODE,
        LoginState.PASSWORD,
        LoginState.PASSKEY,
      ].includes(step) && <HeaderCover isLoading={false} />}

      <div className="flex-grow flex px-6 center sm:mx-auto sm:w-full sm:max-w-md">
        {step === LoginState.EMAIL && (
          <EnterEmail submitEmail={handleEmailSubmit} />
        )}
        {step === LoginState.CODE && (
          <EnterCode email={email} submitCode={handleCodeSubmit} />
        )}
        {step === LoginState.PASSWORD && (
          <EnterPassword onSubmit={handlePasswordSubmit} />
        )}
        {step === LoginState.PASSKEY && (
          <UsePasskey onSubmit={handlePasskeySubmit} />
        )}
      </div>
    </div>
  );
};

export default LoginPage;
