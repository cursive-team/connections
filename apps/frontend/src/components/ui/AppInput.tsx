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
import useSettings from "@/hooks/useSettings";

const InputComponent = classed.input(
  "rounded-[7px] min-h-5 py-2 px-3 text-sm leading-[20px] w-full text-label-primary !outline-none shadow-none focus:border focus:ring-0 focus:outline-none focus:shadow-none focus:outline-offset-0 focus:ring-offset-0 disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-surface-primary border border-stroke-secondary",
        secondary: "bg-surface-quaternary border border-transparent",
      },
      darkMode: {
        true: "placeholder-white/50",
        false: "placeholder-black/50",
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
    const { darkTheme } = useSettings();

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
              <InputComponent
                ref={ref}
                {...props}
                placeholder={placeholder}
                darkMode={darkTheme}
                variant={variant}
                hasError={!!error}
                autoComplete="off"
              />
              {icon && (
                <div className="pointer-events-none w-8 h-8 absolute transform right-0 top-3">
                  <span className="text-icon-primary">{icon}</span>
                </div>
              )}
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
