import React, { useState } from "react";
import { toast } from "sonner";
import { RegisterHeader } from "./RegisterHeader";
import { AppInput } from "@/components/ui/AppInput";
import { AppButton } from "@/components/ui/Button";

interface RegisterWithPasswordProps {
  chipIssuer: string | null;
  onSubmit: (password: string) => Promise<void>;
  onSwitchToPasskey: () => void;
}

const RegisterWithPassword: React.FC<RegisterWithPasswordProps> = ({
  onSubmit,
  onSwitchToPasskey,
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
    <div className="space-y-6">
      <RegisterHeader title=" Register with Password" />
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
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <AppButton type="submit">Register</AppButton>
      </form>
      <AppButton onClick={onSwitchToPasskey} variant="outline">
        Register with passkey
      </AppButton>
    </div>
  );
};

export default RegisterWithPassword;
