import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import EnterEmail from "@/features/login/EnterEmail";
import EnterCode from "@/features/login/EnterCode";
import LoginWithPassword from "@/features/login/LoginWithPassword";
import LoginWithPasskey from "@/features/login/LoginWithPasskey";
import {
  loginUser,
  processLoginResponse,
  requestSigninToken,
} from "@/lib/auth";
import { HeaderCover } from "@/components/ui/HeaderCover";
import useSettings from "@/hooks/useSettings";
import { UserLoginResponse } from "@types";
import { storage } from "@/lib/storage";
import { logClientEvent } from "@/lib/frontend/metrics";

enum LoginState {
  EMAIL = "email",
  CODE = "code",
  PASSWORD = "password",
  PASSKEY = "passkey",
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { pageHeight } = useSettings();
  const [step, setStep] = useState<LoginState>(LoginState.EMAIL);
  const [email, setEmail] = useState("");
  const [loginResponse, setLoginResponse] = useState<UserLoginResponse | null>(
    null
  );

  useEffect(() => {
    const checkLoginStatus = async () => {
      const user = await storage.getUser();
      const session = await storage.getSession();
      if (user && session && session.authTokenExpiresAt > new Date()) {
        logClientEvent("login-already-logged-in", {});
        router.push("/profile");
      }
    };
    checkLoginStatus();
  }, [router]);

  const handleEmailSubmit = async (submittedEmail: string) => {
    logClientEvent("login-email-submit", {});
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
    logClientEvent("login-code-submit", {});
    try {
      const response = await loginUser(email, submittedCode);
      setLoginResponse(response);
      setStep(
        response.registeredWithPasskey
          ? LoginState.PASSKEY
          : LoginState.PASSWORD
      );
    } catch (error) {
      console.error(error);
      toast.error("Invalid code");
    }
  };

  const handlePasswordSubmit = async (password: string) => {
    logClientEvent("login-password-submit", {});
    if (!loginResponse) {
      toast.error("No login found!");
      return;
    }

    try {
      await processLoginResponse(loginResponse, email, password);
      toast.success("Successfully logged in!");
      router.push("/profile");
    } catch (error) {
      console.error("Password authentication error:", error);
      toast.error("Invalid password. Please try again.");
    }
  };

  const handlePasskeySubmit = async (password: string) => {
    logClientEvent("login-passkey-submit", {});
    if (!loginResponse) {
      toast.error("No login found!");
      return;
    }

    try {
      await processLoginResponse(loginResponse, email, password);
      toast.success("Successfully logged in!");
      router.push("/profile");
    } catch (error) {
      console.error("Passkey authentication error:", error);
      toast.error("Passkey authentication failed. Please try again.");
    }
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
          <LoginWithPassword onPasswordLogin={handlePasswordSubmit} />
        )}
        {step === LoginState.PASSKEY && (
          <LoginWithPasskey onPasskeyLogin={handlePasskeySubmit} />
        )}
      </div>
    </div>
  );
};

export default LoginPage;
