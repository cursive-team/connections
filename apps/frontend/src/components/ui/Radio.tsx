import { classed } from "@tw-classed/react";
import { useState } from "react";

interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const RadioLabelBase = classed.span("font-normal", {
  variants: {
    disabled: {
      true: "opacity-50 pointer-events-none",
    },
  },
  defaultVariants: {
    disabled: false,
  },
});
const RadioTitle = classed.span(RadioLabelBase, "text-sm");
const RadioDescription = classed.span(
  RadioLabelBase,
  "ml-6 text-sm text-gray-11"
);

const RadioCircleBase = classed.div(
  "flex relative rounded-full h-[14px] w-[14px] border border-gray-600",
  {
    variants: {
      checked: {
        true: "border-gray-12 before:bg-gray-12",
      },
      disabled: {
        true: "opacity-50 pointer-events-none",
      },
    },
    defaultVariants: {
      checked: false,
    },
  }
);

const RadioCircle = classed.div(
  RadioCircleBase,
  "absolute before:duration-200 before:m-auto before:rounded-full duration-200 before:content-[''] before:h-[6px] before:w-[6px]"
);

const Radio = ({
  id,
  label,
  description,
  disabled,
  checked,
  onChange,
  ...props
}: RadioProps) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    onChange?.(newCheckedState);
  };

  return (
    <div className="relative flex items-center">
      <input
        type="radio"
        className="hidden peer"
        id={id}
        name={id}
        checked={isChecked}
        disabled={disabled}
        onChange={handleToggle}
        {...props}
      />
      <label
        htmlFor={id}
        className="before:content-[''] relative flex flex-col items-start before:absolute before:left-0 before:flex before:h-full before:w-full"
      >
        <div className="flex gap-2 items-center">
          <RadioCircle checked={isChecked} disabled={disabled} />
          <RadioTitle disabled={disabled}>{label}</RadioTitle>
        </div>
        {description && <RadioDescription>{description}</RadioDescription>}
      </label>
    </div>
  );
};

Radio.displayName = "Radio";

export { Radio };
