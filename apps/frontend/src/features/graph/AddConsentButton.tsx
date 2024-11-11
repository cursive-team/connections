import { FC, useEffect, useState } from "react";
import { toast } from "sonner";
import { storage } from "@/lib/storage";
import { logClientEvent } from "@/lib/frontend/metrics";
import { AppButton } from "@/components/ui/Button";
import { toggleGraphConsent } from "@/lib/storage/localStorage/graph";

interface AddGraphConsentButtonProps {
  // If you need to open in new tab vs same window
  openInNewTab?: boolean;
  // Optional custom button text
  buttonText?: string;
  // Optional className for additional styling
  className?: string;
}

export const AddGraphConsentButton: FC<AddGraphConsentButtonProps> = ({
    className,
  }) => {

  const [buttonText, setButtonText] =
    useState("Test");
  const [updatedSetting, setUpdatedSetting] =
    useState(false);

  useEffect(() => {
    const checkSetting = async () => {
      const { user } = await storage.getUserAndSession();
      setButtonText(user.tapGraphEnabled ? 'Disable Graph' : 'Enable Graph');
      setUpdatedSetting(false);
    }
    checkSetting();
  }, [updatedSetting]);

  const handleGraphConsentSetup = async () => {
    logClientEvent("toggle-tap-graph", {});

    const updatedSetting: boolean = await toggleGraphConsent();
    if ( updatedSetting) {
      setUpdatedSetting(true);
    } else {
      toast.error("Something went wrong, please reload and try again.");
    }
  };

  return (
    <AppButton
      variant="outline"
      onClick={handleGraphConsentSetup}
      className={className}
    >
      <span className="text-[14px]">{buttonText}</span>
    </AppButton>
  );
};

export default AddGraphConsentButton;
