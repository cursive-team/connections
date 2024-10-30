import React, { useState } from "react";
import { RegisterHeader } from "@/features/register/RegisterHeader";
import { AppInput } from "@/components/ui/AppInput";
import { AppButton } from "@/components/ui/Button";
import { AppCopy } from "@/components/ui/AppCopy";

interface LoginWithPasswordProps {
  onPasswordLogin: (password: string) => Promise<void>;
  loading: boolean;
}

const LoginWithPassword: React.FC<LoginWithPasswordProps> = ({
  onPasswordLogin,
  loading,
}) => {
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPasswordLogin(password);
  };

  return (
    <div className="flex flex-col grow">
      <RegisterHeader title="Login to your account" />
      <div className="flex flex-col mt-auto gap-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <AppInput
              type="password"
              id="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <AppButton type="submit" loading={loading}>
            Login
          </AppButton>
        </form>
        <AppCopy className="text-center py-4" />
      </div>
    </div>
  );
};

export default LoginWithPassword;
