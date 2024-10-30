import { APP_CONFIG } from "@/config";
import useSettings from "@/hooks/useSettings";
import { AppButton } from "./ui/Button";
import { useState, useRef } from "react";
import { CursiveLogo, HeaderCover } from "./ui/HeaderCover";
import { RegisterHeader as Header } from "@/features/register/RegisterHeader";

interface ErrorFullPageBannerProps {
  isIncognito: boolean;
  isVanadium: boolean;
  isNotMobile: boolean;
}

const ErrorFullPageBanner = ({
  isIncognito,
  isVanadium,
  isNotMobile,
}: ErrorFullPageBannerProps) => {
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

  if (isNotMobile) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center">
        <div className="max-w-[350px] text-center">
          <div className="flex flex-col gap-2 items-center justify-center">
            <CursiveLogo />
            <span className="font-sans py-4 text-[30px] leading-[30px] font-semibold text-primary tracking-[-0.22px]">
              {APP_CONFIG.APP_NAME}
            </span>
            <span className=" font-sans text-base text-tertiary font-medium">
              {`${APP_CONFIG.APP_NAME} is only available on mobile devices. Please visit the website on your phone in order to take part in the experience.`}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: `${pageHeight}px`,
      }}
      className="min-h-screen bg-background flex flex-col"
    >
      <HeaderCover className="!pb-0" />
      <div className="flex flex-col gap-4 mx-auto px-6">
        <div className="flex flex-col gap-2">
          {isVanadium ? (
            <>
              <Header
                title="This browser is not yet supported."
                description={
                  <>
                    <div className="flex flex-col gap-6">
                      <span>
                        We are actively working on adding support for more
                        browsers. In the meantime, please copy this link and
                        paste into another browser.
                      </span>
                      <AppButton variant="outline" onClick={handleCopyLink}>
                        {copied ? "Link copied!" : "Copy link"}
                      </AppButton>
                    </div>
                  </>
                }
              />
            </>
          ) : (
            isIncognito && (
              <>
                <Header
                  title="Cursive Connections doesn't work in incognito."
                  description={
                    <>
                      <div className="flex flex-col gap-6">
                        <span>
                          Incognito mode does not persist browser storage, which
                          is required for the privacy of your data. Please copy
                          this link and paste into a normal browser session,
                          which may require you to login again.
                        </span>
                        <AppButton variant="outline" onClick={handleCopyLink}>
                          {copied ? "Link copied!" : "Copy link"}
                        </AppButton>
                      </div>
                    </>
                  }
                />
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

ErrorFullPageBanner.displayName = "ErrorFullPageBanner";

export { ErrorFullPageBanner };
