import React, { useState } from "react";
import { errorToString, UsernameSchema } from "@types";
import { toast } from "sonner";
import { AppButton } from "@/components/ui/Button";
import { AppInput } from "@/components/ui/AppInput";
import { SupportToast } from "@/components/ui/SupportToast";
import { ERROR_SUPPORT_CONTACT } from "@/constants";

interface FormData {
  username: string;
  displayName: string;
  bio: string;
  telegramHandle: string;
  twitterHandle: string;
}

interface EnterUserInfoProps {
  onSubmit: (userInfo: FormData) => Promise<void>;
  username?: string;
  displayName?: string;
  bio?: string;
  telegramHandle?: string;
  twitterHandle?: string;
}

const EnterUserInfo: React.FC<EnterUserInfoProps> = ({
  onSubmit,
  username = "",
  displayName = "",
  bio = "",
  telegramHandle = "",
  twitterHandle = "",
}) => {
  const [formData, setFormData] = useState<FormData>({
    username,
    displayName,
    bio,
    telegramHandle,
    twitterHandle,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate username
      UsernameSchema.parse(formData.username);

      // Validate handles don't include @
      if (
        formData.telegramHandle.includes("@") ||
        formData.twitterHandle.includes("@")
      ) {
        toast.error("Please enter handles without the '@' symbol");
        return;
      }

      setLoading(true);
      await onSubmit(formData);
      setLoading(false);
    } catch (error) {
      console.error(error);
      if (error instanceof Error && error.message.includes("Username")) {
        toast.error(
          "Username must be alphanumeric and between 3 and 20 characters."
        );
      } else {
        toast(
          SupportToast(
            "",
            true,
            "An error occurred while submitting the form",
            ERROR_SUPPORT_CONTACT,
            errorToString(error)
          )
        );
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col grow">
      <div className="flex flex-col gap-2 py-4">
        <span className="text-[20px] font-semibold font-sans text-label-primary">
          Create an account
        </span>
        <span className="font-sans text-sm font-normal text-label-primary">
          Enter the socials you want to give to others when they tap your NFC
          accessory.
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AppInput
          id="username"
          name="username"
          type="text"
          label="Unique Username"
          required
          value={formData.username}
          onChange={handleChange}
          autoComplete="username"
        />

        <AppInput
          id="displayName"
          name="displayName"
          type="text"
          label="How do you want people to call you?"
          value={formData.displayName}
          onChange={handleChange}
        />

        <AppInput
          id="telegramHandle"
          name="telegramHandle"
          type="text"
          label="Telegram"
          placeholder="without @"
          value={formData.telegramHandle}
          onChange={handleChange}
        />

        <AppInput
          id="twitterHandle"
          name="twitterHandle"
          type="text"
          label="Twitter"
          placeholder="without @"
          value={formData.twitterHandle}
          onChange={handleChange}
        />

        <div className="space-y-2">
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-label-primary"
          >
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            className="w-full px-3 py-2 bg-transparent border border-border rounded-md text-label-primary focus:outline-none focus:ring-2 focus:ring-primary"
            value={formData.bio}
            onChange={handleChange}
          />
        </div>

        <AppButton type="submit" loading={loading} className="w-full">
          Create Profile
        </AppButton>
      </form>
    </div>
  );
};

export default EnterUserInfo;
