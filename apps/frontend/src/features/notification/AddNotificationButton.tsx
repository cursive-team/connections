import { FC } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { storage } from "@/lib/storage";
import { BASE_API_URL } from "@/config";
import { logClientEvent } from "@/lib/frontend/metrics";
import { AppButton } from "@/components/ui/Button";

interface AddNotificationButtonProps {
  // If you need to open in new tab vs same window
  openInNewTab?: boolean;
  // Optional custom button text
  buttonText?: string;
  // Optional className for additional styling
  className?: string;
}

export const AddNotificationButton: FC<AddNotificationButtonProps> = ({
  openInNewTab = true,
  buttonText = "Notifications",
  className,
}) => {
  const router = useRouter();

  const handleNotificationSetup = async () => {
    logClientEvent("set-up-telegram", {});

    const { user, session } = await storage.getUserAndSession();
    if (
      user &&
      session &&
      session.authTokenValue &&
      session.authTokenExpiresAt > new Date()
    ) {
      const url = `${BASE_API_URL}/notification/telegram/link?authToken=${session.authTokenValue}`;

      if (openInNewTab) {
        window.open(url, "_blank");
      } else {
        window.location.href = url;
      }
    } else {
      toast.error("Please log in to access Telegram.");
      router.push("/login");
    }
  };

  return (
    <AppButton
      variant="outline"
      onClick={handleNotificationSetup}
      className={className}
    >
      <span className="text-[14px]">{buttonText}</span>
    </AppButton>
  );
};

export default AddNotificationButton;
