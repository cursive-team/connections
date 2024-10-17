import { APP_CONFIG } from "@/config";
import useSettings from "@/hooks/useSettings";
import { AppButton } from "./ui/Button";
import { useState, useRef } from "react";
import { HeaderCover } from "./ui/HeaderCover";
import { RegisterHeader as Header } from "@/features/register/RegisterHeader";

interface FullPageBannerProps {
  description: string;
  title?: string;
  iconSize?: number;
  isVanadium?: boolean;
}

const FullPageBanner = ({
  description,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  iconSize = 80,
  isVanadium = false,
}: FullPageBannerProps) => {
  const { pageHeight } = useSettings();

  const [copied, setCopied] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopyLink = async () => {
    const currentUrl = window.location.href;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(currentUrl);
        setCopied(true);
      } catch (err) {
        console.error("Failed to copy link using Clipboard API: ", err);
        fallbackCopyTextToClipboard(currentUrl);
      }
    } else {
      fallbackCopyTextToClipboard(currentUrl);
    }

    setTimeout(() => setCopied(false), 3000); // Reset copied state after 3 seconds
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    if (!textAreaRef.current) return;

    const textArea = textAreaRef.current;
    textArea.value = text;
    textArea.focus();
    textArea.select();

    try {
      const successful = document?.execCommand("copy");
      if (successful) {
        setCopied(true);
      } else {
        console.error("Fallback: Unable to copy");
      }
    } catch (err) {
      console.error("Fallback: Unable to copy", err);
    }

    // Reset the text area's value and blur it
    textArea.value = "";
    textArea.blur();
  };

  return (
    <div
      style={{
        minHeight: `${pageHeight}px`,
      }}
      className="min-h-screen bg-gray-100 flex flex-col"
    >
      <HeaderCover className="!pb-0" />
      <div className="flex flex-col gap-4 mx-auto px-10">
        <div className="flex flex-col gap-2">
          {isVanadium ? (
            <>
              <Header
                title="Browser is not supported"
                subtitle="Please copy the link and use link in google chrome"
                description={
                  <>
                    <div className="flex flex-col gap-2">
                      <AppButton variant="outline" onClick={handleCopyLink}>
                        {copied ? "Link copied!" : "Copy link"}
                      </AppButton>
                    </div>
                  </>
                }
              />
            </>
          ) : (
            <Header title={APP_CONFIG.APP_NAME} description={description} />
          )}
        </div>
      </div>
    </div>
  );
};

FullPageBanner.displayName = "FullPageBanner";

export { FullPageBanner };
