import {
  Transition,
  Dialog,
  TransitionChild,
  DialogPanel,
} from "@headlessui/react";
import React, { Fragment, ReactNode, useState } from "react";
import { BASE_API_URL, fontBase } from "@/config";
import { IoIosArrowRoundBack as ArrowBack } from "react-icons/io";
import { IoMdClose as Close } from "react-icons/io";
import { AppButton } from "../ui/Button";
import { DM_Sans } from "next/font/google";
import Image from "next/image";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { logClientEvent } from "@/lib/frontend/metrics";
import { Icons } from "../icons/Icons";

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

const FortuneModal = ({
  isOpen,
  setIsOpen,
  onClose, // run when modal close
  withBackButton = false, // show back button when active
}: ModalProps) => {
  const [step, setStep] = useState(0);

  const onCloseModal = () => {
    onClose?.();
    setIsOpen(false);
  };

  const steps: Step[] = [
    {
      content: (
        <div className="flex flex-col gap-6">
          <Image
            src="/images/ticket.svg"
            className="mx-auto rotate-[23]"
            width={200}
            height={136}
            alt="ticket"
          />
          <span className="font-sans text-center text-primary font-semibold text-[30px] leading-[30px]">
            See your similarity
          </span>
          <span className="text-base text-center font-medium text-primary">
            {`This fortune can’t be read alone. Team up with someone to unlock its shared meaning.`}
          </span>
        </div>
      ),
      enabled: () => true,
    },
    {
      content: (
        <div className="flex flex-col gap-6">
          <Image
            src="/images/arrow.svg"
            className="mx-auto rotate-[23]"
            width={200}
            height={136}
            alt="arrow"
          />
          <span className="font-sans text-center text-primary font-semibold text-[30px] leading-[30px]">
            Check the crystal ball for your pair fortune.
          </span>
          <span className="text-base text-center font-medium text-primary">
            {`It’s in the room. Probably in front of you. Tap again for a new ticket.`}
          </span>
        </div>
      ),
      enabled: () => true,
    },
  ];

  const handleBack = () => {
    setStep(step - 1);
  };

  const submitFortuneRequest = async () => {
    logClientEvent("halloween-fortune-modal-submitted", {});
    const session = await storage.getSession();
    if (!session) {
      toast.error("Please login to use this feature");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_API_URL}/data_hash/pair_connection`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            authToken: session.authTokenValue,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit fortune request");
      }
    } catch (error) {
      console.error("Error submitting fortune request:", error);
      toast.error("Error submitting fortune request");
    }
  };

  const handleNext = async () => {
    if (step === 0) {
      await submitFortuneRequest();
      setStep(1);
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
                    <div className="flex flex-col">
                      {currentStep?.title && (
                        <span className="text-primary text-center font-sans text-[20px] font-bold leading-none">
                          {currentStep?.title}
                        </span>
                      )}
                      {step === 1 ? (
                        <div className="mt-12">{currentStep?.content}</div>
                      ) : (
                        <div className="mt-24">{currentStep?.content}</div>
                      )}
                    </div>
                    {step === 0 && (
                      <AppButton
                        disabled={!isStepEnabled}
                        onClick={() => {
                          handleNext();
                        }}
                        className="mt-auto mb-12"
                      >
                        Use
                      </AppButton>
                    )}
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

FortuneModal.displayName = "FortuneModal";

export { FortuneModal };
