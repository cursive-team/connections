import {
  Transition,
  Dialog,
  TransitionChild,
  DialogPanel,
} from "@headlessui/react";
import React, { Fragment, ReactNode, useState } from "react";
import { Icons } from "../Icons";
import { fontBase } from "@/config";
import { IoIosArrowRoundBack as ArrowBack } from "react-icons/io";
import { IoMdClose as Close } from "react-icons/io";
import { AppButton } from "../ui/Button";
import { DM_Sans } from "next/font/google";
import Image from "next/image";
import { cn } from "@/lib/frontend/util";
import { Tag } from "../ui/Tag";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

interface Step {
  title?: string;
  content: ReactNode;
  enabled: () => boolean;
}

export interface ModalProps
  extends Pick<React.HTMLAttributes<HTMLDivElement>, "children"> {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children?: React.ReactNode;
  closable?: boolean;
  onClose?: () => void;
  withBackButton?: boolean;
}

type ActivityKey =
  | "trickOrTreat"
  | "danceOff"
  | "hideAndSeek"
  | "nameSwap"
  | "deepConversation"
  | "congoLine"
  | "pairFortune"
  | "beNPCs"
  | "meetNewPeople";

const activityMappings: Record<ActivityKey, any> = {
  trickOrTreat: {
    emoji: "🔍",
    label: "trick or treat",
  },
  danceOff: {
    emoji: "🕺",
    label: "dance off",
  },
  hideAndSeek: {
    emoji: "🙈",
    label: "hide & seek",
  },
  nameSwap: {
    emoji: "👑",
    label: "name swap",
  },
  deepConversation: {
    emoji: "💭",
    label: "deep conversation",
  },
  congoLine: {
    emoji: "👯",
    label: "congo line",
  },
  pairFortune: {
    emoji: "🔮",
    label: "pair fortune",
  },
  beNPCs: {
    emoji: "👤",
    label: "be NPCs",
  },
  meetNewPeople: {
    emoji: "🤝",
    label: "meet new people as a team",
  },
};

const activityStates: Record<ActivityKey, boolean> = {
  trickOrTreat: false,
  danceOff: false,
  hideAndSeek: false,
  nameSwap: false,
  deepConversation: false,
  congoLine: false,
  pairFortune: false,
  beNPCs: false,
  meetNewPeople: false,
};

const HalloweenModal = ({
  isOpen,
  setIsOpen,
  onClose, // run when modal close
  withBackButton = false, // show back button when active
}: ModalProps) => {
  const onCloseModal = () => {
    onClose?.();
    setIsOpen(false);
  };

  const [step, setStep] = useState(0);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedPreferences, setSelectedPreferences] = useState<
    string[] | null
  >(null);
  const [mood, setMood] = useState("");

  const moods = [
    { id: "mischievous", image: "mischievous.svg", label: "Mischievous" },
    { id: "awkward", image: "awkward.svg", label: "Awkward" },
    { id: "invisible", image: "invisible.svg", label: "Invisible" },
    { id: "excited", image: "excited.svg", label: "Excited" },
  ];
  const handleToggle = (key: ActivityKey) => {
    // @ts-ignore
    setSelectedPreferences((prev) => ({
      ...prev,
      // @ts-ignore
      [key]: !prev?.[key],
    }));
  };
  const steps: Step[] = [
    {
      title: "",
      content: (
        <div className="flex flex-col gap-6">
          <Image
            src="/images/pumpkin.svg"
            alt="pumpkin"
            width={160}
            height={160}
            className="mx-auto"
          />
          <span className="font-sans text-primary font-semibold text-[30px] leading-[30px]">
            Welcome to the party, [USERNAME]!
          </span>
          <span className="font-sans text-primary font-bold text-[20px] leading-[20px]">
            Get matched with other guests
          </span>
          <span className="font-sans text-tertiary font-medium text-base ">
            {`Add some private data, turn on notifications and we'll let you know
            when we find someone with similar interests!`}
          </span>
        </div>
      ),
      enabled: () => true,
    },
    {
      title: "How are you feeling?",
      content: (
        <div className="grid grid-cols-[1fr_1fr] gap-10">
          {moods?.map((mood) => {
            const isSelected = mood.id === selectedMood;
            return (
              <div
                key={mood.id}
                onClick={() => {
                  setSelectedMood(mood.id);
                }}
                className={cn(
                  "flex flex-col gap-1 text-center p-2",
                  isSelected &&
                    "border border-white bg-gradient-halloween bg-[#FF9DF81A] rounded "
                )}
              >
                <Image
                  alt={mood.id}
                  src={`/images/${mood.image}`}
                  width={140}
                  height={140}
                />
                <span className="text-base text-primary font-medium">
                  {mood.label}
                </span>
              </div>
            );
          })}
        </div>
      ),
      enabled: () => selectedMood != null, // Requires mood selection
    },
    {
      title:
        "Looks like there are a few other lone spirits here… how do you wanna connect?",
      content: (
        <div className=" text-center flex flex-wrap gap-2 mt-5 justify-center">
          {Object.entries(activityStates).map(([key, value]) => {
            return (
              <div key={key} className="flex items-center">
                <input
                  type="checkbox"
                  id={key}
                  checked={value}
                  onChange={() => handleToggle(key as any)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded hidden"
                />
                <Tag
                  variant={value ? "active" : "default"}
                  // @ts-ignore
                  emoji={activityMappings?.[key as any]?.emoji ?? ""}
                  onClick={() => handleToggle(key as any)}
                  text={
                    key.charAt(0).toUpperCase() +
                    key.slice(1).replace(/([A-Z])/g, " $1")
                  }
                />
              </div>
            );
          })}
        </div>
      ),
      enabled: () => true, //(selectedPreferences ?? [])?.length > 0,
    },
    {
      content: (
        <div className="flex flex-col gap-6">
          <Image
            src="/images/elephant.svg"
            className="mx-auto rotate-[23]"
            width={200}
            height={136}
            alt="elephant"
          />
          <span className="font-sans text-primary font-semibold text-[30px] leading-[30px]">
            Get notified when you match!
          </span>
          <span className="text-base font-medium text-primary">
            {`Let Curtis the connections elephant notify you when someone’s
            private data intersects with your own!`}
          </span>
        </div>
      ),
      enabled: () => true,
    },
    {
      content: (
        <div className="flex flex-col gap-6">
          <Image
            src="/images/pot.svg"
            width={160}
            height={160}
            alt="pot"
            className="mx-auto mb-10"
          />
          <span className="font-sans text-primary font-semibold text-[30px] leading-[30px]">
            {`You're all set!`}
          </span>
          <span className="text-base font-medium text-primary">
            {`Keep checking the event page to unlock more vaults and see your connections`}
          </span>
        </div>
      ),
      enabled: () => true,
    },
  ];

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleNext = () => {
    if (step === steps?.length - 1) {
      onClose?.();
      setIsOpen(false);
    } else {
      setStep(step + 1);
    }
  };

  const currentStep = steps?.[step];
  const isStepEnabled = currentStep?.enabled() ?? false ?? false;

  if (!isOpen) return null;
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onCloseModal}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-white/50 z-[100]" />
        </TransitionChild>

        <div
          data-component="modal"
          className={`fixed top-5 bottom-0 left-0 right-0 bg-background rounded-t-[24px] overflow-y-auto z-[100] pb-6 ${fontBase.variable} ${dmSans.variable} font-sans`}
        >
          <div className="flex min-h-full w-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="bg-main fixed top-4 bottom-0 left-0 right-0 bg-shark-970 w-full max-h-screen transform py-6 px-3 xs:px-4 text-left align-middle shadow-xl transition-all">
                <div className="grid grid-cols-[20px_1fr_20px] items-center gap-1">
                  <div>
                    {step > 0 && (
                      <ArrowBack
                        size={18}
                        className="text-primary bg-white/20 p-0.5"
                        onClick={() => {
                          handleBack();
                        }}
                      />
                    )}
                  </div>

                  <div className="h-[7px] bg-[#363636] rounded-[32px]">
                    <div
                      className="h-full bg-active-progress transition-all duration-500 rounded-[32px]"
                      style={{
                        width: `${(step / (steps?.length - 1)) * 100}%`,
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className="ring-0 focus:outline-none outline-none cursor-pointer"
                    onClick={onCloseModal}
                  >
                    {withBackButton ? (
                      <div className="flex items-center gap-1">
                        <Icons.ArrowLeft className="text-white" />
                        <span className="text-primary font-sans text-sm">
                          Back
                        </span>
                      </div>
                    ) : (
                      <Close
                        size={18}
                        className="text-white bg-white/20 p-0.5"
                      />
                    )}
                  </button>
                </div>
                <div className="flex flex-col grow h-full overflow-y-auto mt-8 z-100">
                  <div className="flex flex-col pt-4 grow pb-6 text-white">
                    <div className="flex flex-col gap-6 mb-2">
                      <div className="flex flex-col">
                        {currentStep?.title && (
                          <span className="text-primary text-center font-sans text-[20px] font-bold leading-none">
                            {currentStep?.title}
                          </span>
                        )}
                        <div>{currentStep?.content}</div>
                      </div>
                    </div>
                    <AppButton
                      disabled={!isStepEnabled}
                      onClick={() => {
                        handleNext();
                      }}
                      className="mt-auto mb-6"
                    >
                      Next
                    </AppButton>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

HalloweenModal.displayName = "HalloweenModal";

export { HalloweenModal };
