import type * as Classed from "@tw-classed/react";
import { classed } from "@tw-classed/react";
import {
  ForwardedRef,
  InputHTMLAttributes,
  ReactNode,
  forwardRef,
} from "react";
import { InputWrapper, InputWrapperProps } from "./InputWrapper";
import { cn } from "@/lib/frontend/util";

const InputComponent = classed.input(
  "rounded-[7px] min-h-5 py-2 px-3 placeholder-black/40 text-sm leading-[20px] w-full text-primary !outline-none shadow-none focus:border focus:ring-0 focus:outline-none focus:shadow-none focus:outline-offset-0 focus:ring-offset-0 disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-surface-primary border border-stroke-secondary",
      },
      hasError: {
        true: "!border-b-error",
      },
    },
    defaultVariants: {
      variant: "primary",
      hasError: false,
    },
  }
);

type InputComponentVariants = Classed.VariantProps<typeof InputComponent>;

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "ref">,
    InputComponentVariants,
    Pick<InputWrapperProps, "label" | "description" | "error"> {
  loading?: boolean;
  icon?: React.ReactNode;
  textSize?: "xs" | "sm" | undefined;
  labelPosition?: "top" | "left";
  action?: ReactNode;
}

const AppInput = forwardRef<HTMLInputElement, InputProps>(
  (props: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
    const {
      label,
      variant,
      placeholder,
      description,
      icon,
      error,
      className,
      labelPosition = "top",
      action = null,
    } = props;

    return (
      <div className={cn(action && "grid grid-cols-[1fr_100px] gap-1")}>
        <InputWrapper
          label={label}
          description={description}
          error={error}
          className={className}
          labelPosition={labelPosition}
        >
          <label className="relative form-control w-full">
            <div className="relative">
              {icon && (
                <div className="pointer-events-none w-8 h-8 absolute top-[3.5px] transform left-1">
                  <span className="text-gray-10">{icon}</span>
                </div>
              )}
              <InputComponent
                ref={ref}
                {...props}
                placeholder={placeholder}
                variant={variant}
                hasError={!!error}
                autoComplete="off"
              />
            </div>
          </label>
        </InputWrapper>
        {action && (
          <div className={cn("self-start ", label ? "mt-[26px]" : "")}>
            {action}
          </div>
        )}
      </div>
    );
  }
);

AppInput.displayName = "AppInput";

export { AppInput };
