import { ReactNode, useState } from "react";
import { cn } from "@/lib/frontend/util";
import { GoChevronDown } from "react-icons/go";

interface AccordionProps {
  label: string;
  children?: ReactNode;
}

export const AccordionItem = ({ label, children }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="bg-surface-primary"
      style={{
        boxShadow: "0px -1px 0px 0px #E2E8F0 inset",
      }}
    >
      <button
        className="w-full py-4 text-left flex justify-between items-center focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-primary text-base">{label}</span>
        <GoChevronDown
          className={cn("text-black duration-300 size-4", {
            "rotate-180": isOpen,
          })}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="py-4 pt-0 text-tertiary font-sans text-sm">{children}</p>
      </div>
    </div>
  );
};
