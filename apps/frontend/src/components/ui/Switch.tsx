import { cn } from "@/lib/frontend/util";
import React, { useState } from "react";

interface ToggleSwitchProps {
  label: string;
  onChange?: (checked: boolean) => void;
  checked?: boolean;
}

export default function ToggleSwitch({
  label,
  onChange,
  checked = false,
}: ToggleSwitchProps) {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    onChange?.(newCheckedState);
  };

  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={isChecked}
          onChange={handleToggle}
        />
        <div
          className={cn(
            "block w-[44px] h-6 rounded-full duration-200",
            isChecked
              ? "bg-surface-notice-primary"
              : "bg-surface-notice-secondary"
          )}
        ></div>
        <div
          className={cn(
            "absolute left-1 top-1 bg-white size-[16px] rounded-full transition-transform duration-300 ease-in-out",
            isChecked && "transform translate-x-[18px]"
          )}
        ></div>
      </div>
      <div className="ml-2 text-sm text-primary font-medium font-inter">
        {label}
      </div>
    </label>
  );
}
