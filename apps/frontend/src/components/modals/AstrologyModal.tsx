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

type Zodiak =
  | "capricorn"
  | "aquarius"
  | "pisces"
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius";

const zodiacMappings: Record<Zodiak, any> = {
  capricorn: {
    emoji: "🐐",
    label: "Capricorn",
  },
  aquarius: {
    emoji: "🏺",
    label: "Aquarius",
  },
  pisces: {
    emoji: "🐟",
    label: "Pisces",
  },
  aries: {
    emoji: "🐏",
    label: "Aries",
  },
  taurus: {
    emoji: "🐂",
    label: "Taurus",
  },
  gemini: {
    emoji: "👯",
    label: "Gemini",
  },
  cancer: {
    emoji: "🦀",
    label: "Cancer",
  },
  leo: {
    emoji: "🦁",
    label: "Leo",
  },
  virgo: {
    emoji: "🌾",
    label: "Virgo",
  },
  libra: {
    emoji: "⚖️",
    label: "Libra",
  },
  scorpio: {
    emoji: "🦂",
    label: "Scorpio",
  },
  sagittarius: {
    emoji: "🏹",
    label: "Sagittarius",
  },
};

const zodiacStates: Record<Zodiak, boolean> = {
  capricorn: false,
  aquarius: false,
  pisces: false,
  aries: false,
  taurus: false,
  gemini: false,
  cancer: false,
  leo: false,
  virgo: false,
  libra: false,
  scorpio: false,
  sagittarius: false,
};

const AstrologyModal = ({
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
  const [sunSign, setSunSign] = useState(null);
  const [moonSign, setMoonSign] = useState(null);
  const [risignSign, setRisingSign] = useState(null);
  const [marsSign, setMarsSign] = useState(null);
  const [venusSign, setVenusSign] = useState(null);
  const [mercurySign, setMercurySign] = useState(null);
  const [selectedPreferences, setSelectedPreferences] = useState(zodiacStates);

  const steps: Step[] = [
    {
      title: "",
      content: (
        <div className="flex flex-col gap-6">
          <Image
            src="/images/astrology.svg"
            alt="astrology"
            width={240}
            height={240}
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
      content: (
        <div className="flex flex-col gap-1">
          <span className="text-center text-lg text-white font-bold">
            🌞 <br /> {`What's your  ?`}{" "}
            <span className="text-[#FF9DF8]">sun</span> sign
          </span>
          <div className=" text-center flex flex-wrap gap-2 mt-5 justify-center">
            {Object.entries(zodiacMappings).map(([key, value]) => {
              // @ts-ignore
              const isActive = sunSign === key ?? false;
              return (
                <div key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    id={key}
                    checked={value}
                    onChange={() => setSunSign(key as any)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded hidden"
                  />
                  <Tag
                    variant={isActive ? "active" : "default"}
                    // @ts-ignore
                    emoji={zodiacMappings?.[key as any]?.emoji ?? ""}
                    onClick={() => setSunSign(key as any)}
                    text={
                      key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/([A-Z])/g, " $1")
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      ),
      enabled: () => sunSign !== null,
    },
    {
      content: (
        <div className="flex flex-col gap-1">
          <span className="text-center text-lg text-white font-bold">
            🌜 <br /> {`What's your  ?`}{" "}
            <span className="text-[#FF9DF8]">moon</span> sign
          </span>
          <div className=" text-center flex flex-wrap gap-2 mt-5 justify-center">
            {Object.entries(zodiacMappings).map(([key, value]) => {
              // @ts-ignore
              const isActive = moonSign === key ?? false;
              return (
                <div key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    id={key}
                    checked={value}
                    onChange={() => setMoonSign(key as any)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded hidden"
                  />
                  <Tag
                    variant={isActive ? "active" : "default"}
                    // @ts-ignore
                    emoji={zodiacMappings?.[key as any]?.emoji ?? ""}
                    onClick={() => setMoonSign(key as any)}
                    text={
                      key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/([A-Z])/g, " $1")
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      ),
      enabled: () => moonSign != null,
    },
    {
      content: (
        <div className="flex flex-col gap-1">
          <span className="text-center text-lg text-white font-bold">
            🌅 <br /> {`What's your  ?`}{" "}
            <span className="text-[#FF9DF8]">risign</span> sign
          </span>
          <div className=" text-center flex flex-wrap gap-2 mt-5 justify-center">
            {Object.entries(zodiacMappings).map(([key, value]) => {
              // @ts-ignore
              const isActive = risignSign === key ?? false;
              return (
                <div key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    id={key}
                    checked={value}
                    onChange={() => setRisingSign(key as any)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded hidden"
                  />
                  <Tag
                    variant={isActive ? "active" : "default"}
                    // @ts-ignore
                    emoji={zodiacMappings?.[key as any]?.emoji ?? ""}
                    onClick={() => setRisingSign(key as any)}
                    text={
                      key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/([A-Z])/g, " $1")
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      ),
      enabled: () => risignSign != null,
    },
    {
      content: (
        <div className="flex flex-col gap-1">
          <span className="text-center text-lg text-white font-bold">
            <br /> {`What's your  ?`}{" "}
            <span className="text-[#FF9DF8]">mars</span> sign
          </span>
          <div className=" text-center flex flex-wrap gap-2 mt-5 justify-center">
            {Object.entries(zodiacMappings).map(([key, value]) => {
              // @ts-ignore
              const isActive = marsSign === key ?? false;
              return (
                <div key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    id={key}
                    checked={value}
                    onChange={() => setMarsSign(key as any)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded hidden"
                  />
                  <Tag
                    variant={isActive ? "active" : "default"}
                    // @ts-ignore
                    emoji={zodiacMappings?.[key as any]?.emoji ?? ""}
                    onClick={() => setMarsSign(key as any)}
                    text={
                      key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/([A-Z])/g, " $1")
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      ),
      enabled: () => marsSign != null,
    },
    {
      content: (
        <div className="flex flex-col gap-1">
          <span className="text-center text-lg text-white font-bold">
            <br /> {`What's your  ?`}{" "}
            <span className="text-[#FF9DF8]">venus</span> sign
          </span>
          <div className=" text-center flex flex-wrap gap-2 mt-5 justify-center">
            {Object.entries(zodiacMappings).map(([key, value]) => {
              // @ts-ignore
              const isActive = venusSign === key ?? false;
              return (
                <div key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    id={key}
                    checked={value}
                    onChange={() => setVenusSign(key as any)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded hidden"
                  />
                  <Tag
                    variant={isActive ? "active" : "default"}
                    // @ts-ignore
                    emoji={zodiacMappings?.[key as any]?.emoji ?? ""}
                    onClick={() => setVenusSign(key as any)}
                    text={
                      key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/([A-Z])/g, " $1")
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      ),
      enabled: () => venusSign != null,
    },
    {
      content: (
        <div className="flex flex-col gap-1">
          <span className="text-center text-lg text-white font-bold">
            <br /> {`What's your  ?`}{" "}
            <span className="text-[#FF9DF8]">mercury</span> sign
          </span>
          <div className=" text-center flex flex-wrap gap-2 mt-5 justify-center">
            {Object.entries(zodiacMappings).map(([key, value]) => {
              // @ts-ignore
              const isActive = mercurySign === key ?? false;
              return (
                <div key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    id={key}
                    checked={value}
                    onChange={() => setMercurySign(key as any)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded hidden"
                  />
                  <Tag
                    variant={isActive ? "active" : "default"}
                    // @ts-ignore
                    emoji={zodiacMappings?.[key as any]?.emoji ?? ""}
                    onClick={() => setMercurySign(key as any)}
                    text={
                      key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/([A-Z])/g, " $1")
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      ),
      enabled: () => mercurySign != null,
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

AstrologyModal.displayName = "AstrologyModal";

export { AstrologyModal };
