import React, { useState } from "react";
import { UsernameSchema, errorToString } from "@types";
import { toast } from "sonner";
import { AppButton } from "@/components/ui/Button";
import { AppInput } from "@/components/ui/AppInput";
import { RegisterHeader } from "@/components/ui/RegisterHeader";
import { AppCopy } from "@/components/ui/AppCopy";
import { SupportToast } from "@/components/ui/SupportToast";
import { ERROR_SUPPORT_CONTACT } from "@/constants";

interface EnterUsernameProps {
  submitUsername: (username: string) => Promise<void>;
}

const EnterUsername: React.FC<EnterUsernameProps> = ({ submitUsername }) => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      UsernameSchema.parse(username);
    } catch (error) {
      console.error(error);
      toast.error("Please enter a valid username");
      return;
    }

    try {
      setLoading(true);
      await submitUsername(username);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast(
        SupportToast(
          "",
          true,
          "Please enter a valid username",
          ERROR_SUPPORT_CONTACT,
          errorToString(error)
        )
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
  };

  return (
    <div className="flex flex-col grow">
      <RegisterHeader
        title="Welcome back!"
        description="Log in to your account to continue your Cursive Connections journey. You will be able to retrieve your data from your encrypted backup."
      />
      <div className="flex flex-col mt-auto">
        <form onSubmit={handleSubmit} className="space-y-4 pb-2">
          <div className="text-center mt-1">
            <AppInput
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Username"
              required
              value={username}
              onChange={handleChange}
              description="Enter your username."
            />
          </div>
          <AppButton loading={loading} type="submit">
            Next
          </AppButton>
        </form>
        <AppCopy className="text-center py-4" />
      </div>
    </div>
  );
};

export default EnterUsername;
