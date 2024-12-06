import React, { useState } from "react";
import { errorToString } from "@types";
import { toast } from "sonner";
import { AppButton } from "@/components/ui/Button";
import { AppInput } from "@/components/ui/AppInput";
import { SupportToast } from "@/components/ui/SupportToast";
import { ERROR_SUPPORT_CONTACT } from "@/constants";
import { AppTextarea } from "@/components/ui/Textarea";
import { AppCopy } from "@/components/ui/AppCopy";

interface FormData {
  displayName: string;
  bio: string;
  telegramHandle: string;
  twitterHandle: string;
}

interface EnterUserInfoProps {
  onSubmit: (userInfo: FormData) => Promise<void>;
  displayName?: string;
  bio?: string;
  telegramHandle?: string;
  twitterHandle?: string;
}

const EnterUserInfo: React.FC<EnterUserInfoProps> = ({
  onSubmit,
  displayName = "",
  bio = "",
  telegramHandle = "",
  twitterHandle = "",
}) => {
  const [formData, setFormData] = useState<FormData>({
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
          Set up your NFC chip
        </span>
        <span className="font-sans text-sm font-normal text-label-primary">
          Tapping NFC chips builds a private social graph you can use to
          discover and deepen connections. Add initial info to share with others
          when they tap your chip.
        </span>
      </div>
      <div className="flex flex-col mt-auto gap-4">
        <form onSubmit={handleSubmit} className="space-y-2">
          <AppInput
            id="displayName"
            name="displayName"
            type="text"
            label="Display name"
            placeholder="Enter your name"
            value={formData.displayName}
            onChange={handleChange}
          />

          <AppInput
            id="telegramHandle"
            name="telegramHandle"
            type="text"
            label="Telegram"
            placeholder="Enter username without @"
            value={formData.telegramHandle}
            onChange={handleChange}
          />

          <AppInput
            id="twitterHandle"
            name="twitterHandle"
            type="text"
            label="Twitter"
            placeholder="Enter username without @"
            value={formData.twitterHandle}
            onChange={handleChange}
          />

          <AppTextarea
            label="Bio"
            name="bio"
            autoExpand
            placeholder="Enter a short bio"
            variant="primary"
            value={formData.bio}
            onChange={handleChange}
          />

          <AppButton type="submit" loading={loading} className="w-full">
            Next
          </AppButton>
        </form>

        <AppCopy className="text-center py-4" />
      </div>
    </div>
  );
};

export default EnterUserInfo;
