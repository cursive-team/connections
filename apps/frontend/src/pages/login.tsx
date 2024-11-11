import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import LoginWithPassword from "@/features/login/LoginWithPassword";
import LoginWithPasskey from "@/features/login/LoginWithPasskey";
import { loginUser, processLoginResponse } from "@/lib/auth";
import { HeaderCover } from "@/components/ui/HeaderCover";
import useSettings from "@/hooks/useSettings";
import { errorToString, UserLoginResponse } from "@types";
import { storage } from "@/lib/storage";
import { logClientEvent } from "@/lib/frontend/metrics";
import { SupportToast } from "@/components/ui/SupportToast";
import { ERROR_SUPPORT_CONTACT } from "@/constants";
import EnterUsername from "@/features/login/EnterUsername";

enum LoginState {
  USERNAME = "username",
  PASSWORD = "password",
  PASSKEY = "passkey",
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { pageHeight } = useSettings();
  const [step, setStep] = useState<LoginState>(LoginState.USERNAME);
  const [loginResponse, setLoginResponse] = useState<UserLoginResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  // Halloween change, remove afterwards
  useEffect(() => {
    const removeHWClass = async () => {
      document.getElementsByTagName("body")[0].classList.remove("dark-theme");
    };
    removeHWClass();
  });

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

  const handleUsernameSubmit = async (submittedUsername: string) => {
    logClientEvent("login-username-submit", {});
    try {
      const response = await loginUser(submittedUsername);
      setLoginResponse(response);
      setStep(
        response.registeredWithPasskey
          ? LoginState.PASSKEY
          : LoginState.PASSWORD
      );
    } catch (error) {
      console.error(error);
      toast(
        SupportToast(
          "",
          true,
          "Invalid username",
          ERROR_SUPPORT_CONTACT,
          errorToString(error)
        )
      );
    }
  };

  const handlePasswordSubmit = async (password: string) => {
    logClientEvent("login-password-submit", {});
    if (!loginResponse) {
      toast.error("No login found!");
      return;
    }

    try {
      setLoading(true);
      await processLoginResponse(loginResponse, loginResponse.email, password);

      // If you have a proper login, clean up localstorage
      await storage.deleteUnregisteredUser();
      toast.success("Successfully logged in!");
      router.push("/profile");
    } catch (error) {
      console.error("Password authentication error:", error);
      toast(
        SupportToast(
          "",
          true,
          "Invalid password. Please try again",
          ERROR_SUPPORT_CONTACT,
          errorToString(error)
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasskeySubmit = async (password: string) => {
    logClientEvent("login-passkey-submit", {});
    if (!loginResponse) {
      toast.error("No login found!");
      return;
    }

    try {
      setLoading(true);
      await processLoginResponse(loginResponse, loginResponse.email, password);
      toast.success("Successfully logged in!");
      router.push("/profile");
    } catch (error) {
      console.error("Passkey authentication error:", error);
      toast(
        SupportToast(
          "",
          true,
          "Passkey authentication failed",
          ERROR_SUPPORT_CONTACT,
          errorToString(error)
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      style={{
        minHeight: `${pageHeight}px`,
      }}
    >
      {[LoginState.USERNAME, LoginState.PASSWORD, LoginState.PASSKEY].includes(
        step
      ) && <HeaderCover isLoading={false} />}

      <div className="flex-grow flex px-6 center sm:mx-auto sm:w-full sm:max-w-md">
        {step === LoginState.USERNAME && (
          <EnterUsername submitUsername={handleUsernameSubmit} />
        )}
        {step === LoginState.PASSWORD && (
          <LoginWithPassword
            loading={loading}
            onPasswordLogin={handlePasswordSubmit}
          />
        )}
        {step === LoginState.PASSKEY && (
          <LoginWithPasskey
            loading={loading}
            onPasskeyLogin={handlePasskeySubmit}
          />
        )}
      </div>
    </div>
  );
};

export default LoginPage;
