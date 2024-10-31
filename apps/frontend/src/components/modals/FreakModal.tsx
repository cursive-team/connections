import {
  Transition,
  Dialog,
  TransitionChild,
  DialogPanel,
} from "@headlessui/react";
import React, { Fragment, ReactNode, useState } from "react";
import { Icons } from "../icons/Icons";
import { fontBase } from "@/config";
import { IoIosArrowRoundBack as ArrowBack } from "react-icons/io";
import { IoMdClose as Close } from "react-icons/io";
import { AppButton } from "../ui/Button";
import { DM_Sans } from "next/font/google";
import Image from "next/image";
import { logClientEvent } from "@/lib/frontend/metrics";
import { LannaHalloweenData } from "@/lib/storage/types/user/userData/lannaHalloweenData";
import { toast } from "sonner";

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
  onSubmit: (data: LannaHalloweenData) => Promise<void>;
}

const FreakModal = ({
  isOpen,
  setIsOpen,
  onClose, // run when modal close
  withBackButton = false, // show back button when active
  onSubmit,
}: ModalProps) => {
  const onCloseModal = () => {
    onClose?.();
    setIsOpen(false);
  };

  const [step, setStep] = useState(0);

  const [goodTime, setGoodTime] = useState<null | number>(null);
  const [experience, setExperience] = useState<null | number>(null);
  const [unusualItem, setUnusualItem] = useState<null | number>(null);
  const [uniqueChallange, setUniqueChallange] = useState<null | number>(null);

  const goodTimesItems = [
    {
      id: 1,
      label:
        "🕺 Trying something totally out-of-the-box, like ecstatic dancing",
    },
    {
      id: 2,
      label:
        "🍀 Finding the nearest spot with trivia or puzzles to solve together",
    },
    {
      id: 3,
      label: "👀 People-watching and imagining everyone's secret lives",
    },
    {
      id: 4,
      label: "🤝 Creating weird handshakes or silly games",
    },
  ];

  const experiencesItems = [
    {
      id: 5,
      label: "👻 Participating in a local ghost tour",
    },
    {
      id: 6,
      label: "✨ A meditation or sound bath session to just vibe",
    },
    {
      id: 7,
      label: "🧩 Testing out old-school games like hopscotch or four-square",
    },
    {
      id: 8,
      label: "🎥 Watching the most bizarre movies from different cultures",
    },
  ];

  const unusualItems = [
    {
      id: 9,
      label:
        "🔮 A personal fortune-telling kit complete with tarot cards and a crystal ball",
    },
    {
      id: 10,
      label:
        "📜 A vintage typewriter that lets me leave poetic notes in unexpected places",
    },
    {
      id: 11,
      label:
        "🗝️ A treasure chest full of random trinkets I can use for scavenger hunts",
    },
    {
      id: 12,
      label: "🌙 A notebook filled with weird dreams I've had over the years",
    },
  ];

  const uniqueChallangeItems = [
    {
      id: 13,
      label:
        "🗺️ Learn the basics of three new languages just enough to surprise people",
    },
    {
      id: 14,
      label: "🎶 Try a different genre of music every day for the month",
    },
    {
      id: 15,
      label: "📸 Take one candid photo of a stranger daily for an art project",
    },
    {
      id: 16,
      label:
        "🧭 Walk a different route to every destination just to see where I end up",
    },
  ];

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
            {`Who’s gonna match your freak?`}
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
      title: "What's your idea of a good time when meeting someone new?",
      content: (
        <div className="flex flex-col gap-6 mt-16">
          {goodTimesItems?.map((item, index) => {
            const isChecked = goodTime === item.id;
            return (
              <div
                key={index}
                className="grid grid-cols-[24px_1fr] items-center gap-2"
                onClick={() => {
                  setGoodTime(item.id);
                }}
              >
                <button
                  className={`w-6 h-6 rounded flex items-center justify-center border ${
                    isChecked ? "bg-white" : "border-white"
                  }`}
                  aria-checked={isChecked}
                  role="checkbox"
                >
                  {isChecked && <Icons.Checked />}
                </button>
                <span className="text-sm text-primary font-medium leading-none">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      ),
      enabled: () => goodTime != null,
    },
    {
      title: "What kind of unusual experience are you always down for?",
      content: (
        <div className="flex flex-col gap-6 mt-16">
          {experiencesItems?.map((item, index) => {
            const isChecked = experience === item.id;
            return (
              <div
                key={index}
                className="grid grid-cols-[24px_1fr] items-center gap-2"
                onClick={() => {
                  setExperience(item.id);
                }}
              >
                <button
                  className={`w-6 h-6 rounded flex items-center justify-center border ${
                    isChecked ? "bg-white" : "border-white"
                  }`}
                  aria-checked={isChecked}
                  role="checkbox"
                >
                  {isChecked && <Icons.Checked />}
                </button>
                <span className="text-sm text-primary font-medium leading-none">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      ),
      enabled: () => experience != null,
    },
    {
      title: "What unusual item would you be most excited to own?",
      content: (
        <div className="flex flex-col gap-6 mt-16">
          {unusualItems?.map((item, index) => {
            const isChecked = unusualItem === item.id;
            return (
              <div
                key={index}
                className="grid grid-cols-[24px_1fr] items-center gap-2"
                onClick={() => {
                  setUnusualItem(item.id);
                }}
              >
                <button
                  className={`w-6 h-6 rounded flex items-center justify-center border ${
                    isChecked ? "bg-white" : "border-white"
                  }`}
                  aria-checked={isChecked}
                  role="checkbox"
                >
                  {isChecked && <Icons.Checked />}
                </button>
                <span className="text-sm text-primary font-medium leading-none">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      ),
      enabled: () => unusualItem != null,
    },
    {
      title:
        "If you were to set a “unique” challenge for yourself this month, what would it be?",
      content: (
        <div className="flex flex-col gap-6 mt-16">
          {uniqueChallangeItems?.map((item, index) => {
            const isChecked = uniqueChallange === item.id;
            return (
              <div
                key={index}
                className="grid grid-cols-[24px_1fr] items-center gap-2"
                onClick={() => {
                  setUniqueChallange(item.id);
                }}
              >
                <button
                  className={`w-6 h-6 rounded flex items-center justify-center border ${
                    isChecked ? "bg-white" : "border-white"
                  }`}
                  aria-checked={isChecked}
                  role="checkbox"
                >
                  {isChecked && <Icons.Checked />}
                </button>
                <span className="text-sm text-primary font-medium leading-none">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      ),
      enabled: () => uniqueChallange != null,
    },
  ];

  const handleBack = () => {
    setStep(step - 1);
  };

  const onHandleSubmit = async () => {
    const data = { goodTime, experience, unusualItem, uniqueChallange };
    if (
      !data.goodTime ||
      !data.experience ||
      !data.unusualItem ||
      !data.uniqueChallange
    ) {
      toast.error("Please select all options");
      return;
    }

    logClientEvent("halloween-freak-modal-submitted", {});
    await onSubmit({
      fun: {
        goodTimes: {
          value: data.goodTime.toString(),
          hashData: [],
        },
        experiences: {
          value: data.experience.toString(),
          hashData: [],
        },
        unusualItems: {
          value: data.unusualItem.toString(),
          hashData: [],
        },
        uniqueChallenge: {
          value: data.uniqueChallange.toString(),
          hashData: [],
        },
      },
    });
  };

  const handleNext = () => {
    if (step === steps?.length - 1) {
      onClose?.();
      setIsOpen(false);
      onHandleSubmit();
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

FreakModal.displayName = "FreakModal";

export { FreakModal };
