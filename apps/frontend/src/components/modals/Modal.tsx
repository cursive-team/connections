import {
  Transition,
  Dialog,
  TransitionChild,
  DialogPanel,
} from "@headlessui/react";
import React, { Fragment } from "react";
import { Icons } from "../Icons";
import { fontBase } from "@/config";
import { cn } from "@/lib/frontend/util";

export interface ModalProps
  extends Pick<React.HTMLAttributes<HTMLDivElement>, "children"> {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children?: React.ReactNode;
  closable?: boolean;
  onClose?: () => void;
  withBackButton?: boolean;
}

const Modal = ({
  isOpen,
  setIsOpen,
  children,
  closable = true, // show close button when active
  onClose, // run when modal close
  withBackButton = false, // show back button when active
}: ModalProps) => {
  const onCloseModal = () => {
    onClose?.();
    setIsOpen(false);
  };

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
          <div className="fixed inset-0 bg-white z-[100]" />
        </TransitionChild>

        <div
          data-component="modal"
          className={`fixed inset-0 overflow-y-auto z-[100] ${fontBase.variable} font-sans`}
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
              <DialogPanel className="bg-main fixed top-0 bottom-0 left-0 right-0 bg-shark-970 w-full max-h-screen transform py-6 px-3 xs:px-4 text-left align-middle shadow-xl transition-all">
                {closable && (
                  <div
                    className={cn(
                      "fixed z-100 top-0 flex items-center h-12 py-8",
                      withBackButton ? "left-4" : "right-[24px]"
                    )}
                  >
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
                        <Icons.Close size={20} className="text-white" />
                      )}
                    </button>
                  </div>
                )}
                <div className="flex flex-col grow h-full overflow-y-auto mt-8 z-100">
                  <div className="pt-4 pb-6 grow text-white">{children}</div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

Modal.displayName = "Modal";

export { Modal };
