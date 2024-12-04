import React, { useState } from "react";
import { toast } from "sonner";
import { AppInput } from "@/components/ui/AppInput";
import { AppButton } from "@/components/ui/Button";
import { AppCopy } from "@/components/ui/AppCopy";

interface RegisterWithPasswordProps {
  onSubmit: (password: string) => Promise<void>;
  onGoBack: () => void;
}

const RegisterWithPassword: React.FC<RegisterWithPasswordProps> = ({
  onSubmit,
  onGoBack,
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    onSubmit(password);
  };

  return (
    <div className="flex flex-col grow">
      <div className="flex flex-col gap-2 py-4">
        <span className="text-[20px] font-semibold font-sans text-label-primary">
          Choose a secure password
        </span>
        <span className="font-sans text-sm font-normal text-label-primary">
          This password is used to encrypt your data.
        </span>
      </div>
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
          <div>
            <AppInput
              type="password"
              id="confirmPassword"
              label="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <AppButton type="submit">Submit</AppButton>
        </form>
        <AppButton type="button" variant="outline" onClick={onGoBack}>
          Back
        </AppButton>
        <AppCopy className="text-center py-4" />
      </div>
    </div>
  );
};

export default RegisterWithPassword;
