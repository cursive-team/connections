import React, { useState } from "react";
import { UsernameSchema } from "@types";
import { verifyUsernameIsUnique } from "@/lib/auth/util";
import { toast } from "sonner";
import { MdKeyboardArrowRight as ArrowRightIcon } from "react-icons/md";
import { IoMdCheckmark as CheckIcon } from "react-icons/io";
import { IoCloseSharp as CloseIcon } from "react-icons/io5";

import useSettings from "@/hooks/useSettings";

interface FormData {
  username: string;
  displayName: string;
  bio: string;
  telegramHandle: string;
  twitterHandle: string;
}

interface EnterUserInfoProps {
  chipIssuer: string | null;
  onSubmit: (userInfo: FormData) => Promise<void>;
}

const EnterUserInfo: React.FC<EnterUserInfoProps> = ({
  chipIssuer,
  onSubmit,
}) => {
  const [step, setStep] = useState(0);
  const { pageHeight } = useSettings();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    displayName: "",
    bio: "",
    telegramHandle: "",
    twitterHandle: "",
  });

  const steps: {
    field: keyof FormData;
    question?: string;
    placeholder?: string;
    required: boolean;
  }[] = [
    { field: "username", question: "Choose a username....", required: true },
    {
      field: "displayName",
      question: "What's your full name?",
      required: true,
    },
    {
      field: "telegramHandle",
      question: "What is your Telegram handle?",
      required: false,
      placeholder: "Telegram",
    },
    {
      field: "twitterHandle",
      question: "What is your X handle?",
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

  const handleInputChange = (value: string) => {
    setFormData((prev) => ({ ...prev, [steps[step].field]: value }));
  };

  const isStepValid = () => {
    const currentStep = steps[step];
    return (
      !currentStep.required ||
      formData[currentStep.field as keyof FormData].trim() !== ""
    );
  };

  const handleSubmit = async (e: unknown) => {
    if (step < steps.length - 1) {
      return; // Don't submit if not on the last step
    }

    // @ts-ignore
    e?.preventDefault();
    try {
      UsernameSchema.parse(formData.username);
      const isUnique = await verifyUsernameIsUnique(formData.username);
      if (!isUnique) {
        toast.error("Username is already taken");
        return;
      }
      await onSubmit(formData);
    } catch (error) {
      console.error(error);
      toast.error("Please enter a valid username");
    }
  };

  const handleNext = (e: unknown) => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleSubmit(e);
    }
  };

  const handleKeyDown = (e: unknown) => {
    // @ts-ignore
    if (e?.key === "Enter" && !e?.shiftKey) {
      // @ts-ignore
      e?.preventDefault();
      if (isStepValid()) {
        handleNext(e);
      }
    }
  };

  const previewList = steps.slice(0, step).reverse();

  return (
    <div
      onSubmit={handleSubmit}
      className="relative h-full space-y-6 -mt-10"
      style={{
        height: `${pageHeight}px`,
      }}
    >
      <div className="flex flex-col gap-2">
        <span className=" text-lg font-semibold font-sans text-primary ">
          Link your contact info
        </span>
        <span className=" font-sans text-sm font-normal">
          The info you enter will be saved to your Cursive chip, allowing you to
          share it instantly with a tap.
        </span>
      </div>
      {chipIssuer && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Registering chip issued by: {chipIssuer}
        </p>
      )}

      <div className="relative mb-6">
        <ArrowRightIcon className="absolute size-6 left-0 top-1/2 transform -translate-y-1/2 text-primary" />
        {steps[step].field === "bio" ? (
          <textarea
            className="w-full pl-8 pr-4 py-2 text-lg font-semibold font-sans focus:outline-none min-h-[100px] resize-none  bg-transparent"
            placeholder={steps[step].question}
            value={formData.bio}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label={steps[step].question}
          />
        ) : (
          <input
            type="text"
            className="w-full pl-8 pr-4 py-2 text-lg bg-transparent font-semibold font-sans focus:outline-none "
            placeholder={steps[step].question}
            value={formData[steps[step].field as keyof FormData]}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label={steps[step].question}
            required={steps[step].required}
          />
        )}
      </div>

      {previewList.map((s, index) => {
        const fieldValue = formData[s.field as keyof FormData];
        return (
          index < step && (
            <div key={s.field} className="flex items-center   gap-1">
              {fieldValue ? (
                <CheckIcon
                  className="size-5 text-quaternary"
                  width={24}
                  height={24}
                />
              ) : (
                <CloseIcon
                  className="size-5 text-quaternary"
                  width={24}
                  height={24}
                />
              )}
              <span className="font-sans text-sm font-semibold text-quaternary">
                {fieldValue || s.placeholder || "-"}
              </span>
            </div>
          )
        );
      })}

      <div className="flex flex-col w-full fixed bottom-0 left-0 right-0">
        <div
          className="h-[2px] w-full"
          style={{
            background:
              "linear-gradient(90deg, #7A74BC 0%, #FF9DF8 39%, #FB5D42 71%, #F00 100%)",
          }}
        ></div>
        <button
          type="button"
          onClick={handleNext}
          disabled={!isStepValid()}
          className="h-12 font-bold text-primary font-sans text-lg uppercase disabled:text-tertiary duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EnterUserInfo;
