import { classed } from "@tw-classed/react";
import type * as Classed from "@tw-classed/react";
import { ReactNode } from "react";

const InputLabel = classed.div(
  "text-primary text-sm font-sans font-medium leading-5"
);

const InputDescription = classed.div(
  "text-secondary text-[12px] font-sans font-normal leading-4"
);

const InputError = classed.div(
  "absolute text-error text-xs leading-4 -bottom-5 text-red-400"
);

const InputSpacing = classed.div("relative flex flex-col gap-[8px]");

type InputLabelVariants = Classed.VariantProps<typeof InputLabel>;
type InputDescriptionVariants = Classed.VariantProps<typeof InputDescription>;
type InputSpacingVariants = Classed.VariantProps<typeof InputSpacing>;

export interface InputWrapperProps
  extends React.HTMLAttributes<HTMLDivElement>,
    InputLabelVariants,
    InputDescriptionVariants,
    InputSpacingVariants {
  label?: string;
  error?: string;
  description?: ReactNode;
  children: ReactNode;
  labelPosition?: "top" | "left";
}

const InputWrapper = ({
  label,
  children,
  description,
  error, // error message to display
  className = "",
  labelPosition = "top",
}: InputWrapperProps) => {
  if (labelPosition === "top") {
    return (
      <InputSpacing className={className}>
        <InputSpacing>
          {label && <InputLabel>{label}</InputLabel>}
          <div className={className}>{children}</div>
        </InputSpacing>
        {error ? (
          <InputError>{error}</InputError>
        ) : (
          <>
            {description && <InputDescription>{description}</InputDescription>}
          </>
        )}
      </InputSpacing>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-[100px_1fr] items-center w-full gap-4 grow">
        {label && <InputLabel>{label}</InputLabel>}
        <div className="flex flex-col w-full">
          <div className={className}>{children}</div>
        </div>
      </div>
    </div>
  );
};

InputWrapper.displayName = "InputWrapper";

export { InputWrapper, InputDescription };
