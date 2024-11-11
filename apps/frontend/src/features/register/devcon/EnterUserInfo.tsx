import React, { useEffect, useRef, useState } from "react";
import { errorToString } from "@types";
import { toast } from "sonner";
import { MdKeyboardArrowRight as ArrowRightIcon } from "react-icons/md";
import { IoMdCheckmark as CheckIcon } from "react-icons/io";
import { IoCloseSharp as CloseIcon } from "react-icons/io5";

import useSettings from "@/hooks/useSettings";
import { AppButton } from "@/components/ui/Button";
import { Icons } from "@/components/icons/Icons";
import { SupportToast } from "@/components/ui/SupportToast";
import { ERROR_SUPPORT_CONTACT } from "@/constants";

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
  const [step, setStep] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { pageHeight } = useSettings();
  const [formData, setFormData] = useState<FormData>({
    displayName,
    bio,
    telegramHandle,
    twitterHandle,
  });

  const steps: {
    field: keyof FormData;
    question?: string;
    placeholder?: string;
    required: boolean;
  }[] = [
    {
      field: "displayName",
      question: "What's your full name?",
      required: false,
    },
    {
      field: "telegramHandle",
      question: "What is your Telegram handle?",
      required: false,
      placeholder: "Telegram",
    },
    {
      field: "twitterHandle",
      question: "What is your Twitter handle?",
      required: false,
      placeholder: "Twitter",
    },
    {
      field: "bio",
      question: "Share a brief bio",
      required: false,
      placeholder: "Bio",
    },
  ];

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, []);

  const handleInputChange = (value: string) => {
    setFormData((prev) => ({ ...prev, [steps[step].field]: value }));
    adjustTextareaHeight();
  };

  const isStepValid = () => {
    const currentStep = steps[step];
    return (
      !currentStep.required ||
      formData[currentStep.field as keyof FormData].trim() !== ""
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmit = async (e: unknown) => {
    if (step < steps.length - 1) {
      return; // Don't submit if not on the last step
    }

    const { bio, telegramHandle, twitterHandle, displayName } = formData ?? {};
    try {
      await onSubmit({
        displayName: displayName.trim(),
        bio: bio.trim(),
        telegramHandle: telegramHandle.trim(),
        twitterHandle: twitterHandle.trim(),
      });
    } catch (error) {
      console.error(error);
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
  };

  const handleNext = async (e: unknown) => {
    if (step === 1 || step === 2) {
      // Validate Telegram and Twitter handles
      const handle = formData[steps[step].field as keyof FormData];
      if (handle.includes("@")) {
        toast.error("Please enter handles without the '@' symbol");
        return;
      }
    }

    if (step < steps.length) {
      setStep(step + 1);
    } else {
      handleSubmit(e);
    }
  };

  const handleKeyDown = (e: unknown) => {
    // @ts-expect-error - e is unknown
    if (e?.key === "Enter" && !e?.shiftKey) {
      if (isStepValid()) {
        handleNext(e);
      }
    }
  };

  const previewList = steps.slice(0, step).reverse();

  return (
    <div
      onSubmit={handleSubmit}
      className="flex flex-col relative h-full  py-2"
      style={{
        height: `${pageHeight}px`,
      }}
    >
      <div className="flex flex-col gap-2 py-4">
        <span className="text-[20px] font-semibold font-sans text-label-primary ">
          Link your contact info
        </span>
        <span className="font-sans text-sm font-normal text-label-primary">
          This contact info will be shared when others tap your Cursive chip.
          You can modify this data in the app, or choose other socials like
          Signal and Farcaster.
        </span>
      </div>
      <div className="flex flex-col col-gap-4">
        {steps?.[step] && (
          <div className="relative mb-6">
            {steps?.[step]?.field === "bio" ? (
              <>
                <ArrowRightIcon className="absolute size-6 left-0 top-0 transform text-label-primary" />
                <div className="flex items-start gap-4">
                  <textarea
                    ref={textareaRef}
                    className="w-full pl-8 pr-4 pt-0.5 text-[14px] text-label-primary font-semibold font-sans focus:outline-none min-h-[30px] resize-none bg-transparent"
                    placeholder={steps[step].question}
                    value={formData[steps[step].field as keyof FormData]}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    aria-label={steps[step].question}
                    required={steps[step].required}
                  />
                  <button
                    className="text-sm text-link-primary font-sans font-semibold"
                    onClick={() => {
                      handleNext({});
                    }}
                  >
                    {steps[step].required ||
                    formData[steps[step].field as keyof FormData] !== ""
                      ? "Next"
                      : "Skip"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <ArrowRightIcon className="absolute size-6 left-0 top-1/2 transform -translate-y-1/2 text-label-primary" />
                <div className="flex items-start gap-4">
                  <input
                    type="text"
                    className="w-full pl-8 pr-4 py-2 text-[14px] text-label-primary bg-transparent font-semibold font-sans focus:outline-none "
                    placeholder={steps[step].question}
                    value={formData[steps[step].field as keyof FormData]}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    aria-label={steps[step].question}
                    required={steps[step].required}
                  />
                  <button
                    className="text-sm text-link-primary font-semibold font-sans mt-2"
                    onClick={() => {
                      handleNext({});
                    }}
                  >
                    {steps[step].required ||
                    formData[steps[step].field as keyof FormData] !== ""
                      ? "Next"
                      : "Skip"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {previewList.map((s, index) => {
            const fieldValue = formData[s.field as keyof FormData];
            return (
              index < step && (
                <div
                  key={s.field}
                  className="flex items-center gap-4"
                  onClick={() => {
                    setStep(step - index - 1);
                  }}
                >
                  {fieldValue ? (
                    <CheckIcon
                      className="size-5 text-label-quaternary"
                      width={24}
                      height={24}
                    />
                  ) : (
                    <CloseIcon
                      className="size-5 text-label-quaternary"
                      width={24}
                      height={24}
                    />
                  )}

                  <span className="font-sans text-[14px] w-full font-semibold text-label-quaternary">
                    {fieldValue || s.placeholder || "-"}
                  </span>

                  <Icons.Pencil className="ml-auto text-label-quaternary" />
                </div>
              )
            );
          })}
        </div>
      </div>

      <div className="flex flex-col mt-auto w-full py-4">
        <AppButton
          type="button"
          onClick={handleNext}
          disabled={steps?.length > step}
        >
          Done
        </AppButton>
      </div>
    </div>
  );
};

export default EnterUserInfo;
