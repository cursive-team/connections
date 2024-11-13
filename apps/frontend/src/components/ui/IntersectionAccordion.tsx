import { ReactNode, useState } from "react";
import { cn } from "@/lib/frontend/util";
import { GoChevronDown } from "react-icons/go";
import useSettings from "@/hooks/useSettings";

interface IntersectionAccordionProps {
  label: string;
  icon?: string;
  children?: ReactNode;
}

export const IntersectionAccordion = ({
  icon,
  label,
  children,
}: IntersectionAccordionProps) => {
  const { darkTheme } = useSettings();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={cn(
        "bg-background text-label-primary border rounded-lg",
        darkTheme ? "border-white/20" : "border-black/20"
      )}
    >
      <button
        className="w-full p-2 text-left flex justify-between items-center focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex gap-2 items-center">
          {icon && <span>{icon}</span>}
          <span className="font-medium text-label-primary text-sm">
            {label}
          </span>
        </div>
        <GoChevronDown
          className={cn("text-icon-primary duration-300 size-4", {
            "rotate-180": isOpen,
          })}
        />
      </button>
      <div
        className={`px-2 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[900px] opacity-100 pb-4" : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};
