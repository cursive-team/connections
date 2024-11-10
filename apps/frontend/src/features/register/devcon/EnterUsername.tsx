import React, { useState } from "react";
import { UsernameSchema, errorToString } from "@types";
import { toast } from "sonner";
import { AppButton } from "@/components/ui/Button";
import { AppInput } from "@/components/ui/AppInput";
import { RegisterHeader } from "../../../components/ui/RegisterHeader";
import { AppCopy } from "@/components/ui/AppCopy";
import { SupportToast } from "@/components/ui/SupportToast";
import { ERROR_SUPPORT_CONTACT } from "@/constants";

interface EnterUsernameProps {
  submitUsername: (username: string) => Promise<void>;
  defaultUsername?: string;
}

const EnterUsername: React.FC<EnterUsernameProps> = ({
  submitUsername,
  defaultUsername = "",
}) => {
  const [username, setUsername] = useState(defaultUsername);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      UsernameSchema.parse(username);
    } catch (error) {
      console.error(error);
      toast.error(
        "Username must be alphanumeric and between 3 and 20 characters."
      );
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
          "Unexpected error submitting username",
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
        title="Discover & deepen connection at Devcon!"
        description={
          <div className="flex flex-col gap-2">
            <ul className="list-disc pl-4 space-y-2">
              <li>Easily share socials with your NFC chip</li>
              <li>
                Discover overlapping events and hot takes with private set
                intersections
              </li>
              <li>
                Receive high-quality opportunites while maintaining data privacy
                with MPC
              </li>
            </ul>
          </div>
        }
      />
      <div className="flex flex-col mt-auto">
        <form onSubmit={handleSubmit} className="space-y-4 pb-2">
          <div className="mt-1">
            <AppInput
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Username"
              required
              value={username}
              onChange={handleChange}
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
