import * as React from "react";
import type * as Classed from "@tw-classed/react";
import { classed } from "@tw-classed/react";
import { cn } from "@/lib/frontend/util";
import { Icons } from "@/components/icons/Icons";

const ButtonComponent = classed.button(
  "font-base flex items-center disabled:opacity-20 disabled:pointer-events-none w-full flex focus:ring-0 focus:outline-none active:scale-95",
  {
    variants: {
      size: {
        lg: "py-2 px-6 text-base leading-[19px] font-medium",
        md: "py-2 px-4 text-sm leading-[19px] font-medium",
        sm: "py-2 px-2 text-xs leading-[19px] font-medium",
      },
      variant: {
        primary:
          "bg-button-primary hover:bg-button-primary-hover text-button-primary-label",
        secondary:
          "bg-button-secondary hover:bg-button-secondary-hover text-button-secondary-label border border-stroke-primary",
        outline:
          "bg-button-outline hover:bg-button-outline-hover text-button-outline-label border border-stroke-primary",
        ghost:
          "bg-button-ghost hover:bg-button-ghost-hover text-button-ghost-label",
        subtle:
          "bg-button-subtle hover:bg-button-subtle-hover text-button-subtle-label",
        link: "bg-button-link hover:bg-button-link-hover text-button-link-label hover:text-button-link-label-hover hover:underline",
      },
      rounded: {
        true: "rounded-[7px]",
      },
      align: {
        center: "justify-center",
        left: "justify-start",
        right: "justify-end",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      rounded: true,
      align: "center",
    },
    compoundVariants: [
      {
        size: "medium",
        variant: "transparent",
        className: "!py-0",
      },
    ],
  }
);

type ButtonVariants = Classed.VariantProps<typeof ButtonComponent>;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {
  loading?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any;
  iconPosition?: "left" | "right";
}

const IconVariants: Record<NonNullable<ButtonVariants["size"]>, string> = {
  lg: "w-3 h-3",
  md: "w-3 h-3",
  sm: "w-3 h-3",
};
const LoadingSpinner = ({ size }: Pick<ButtonProps, "size">) => {
  const iconSize = IconVariants[size ?? "md"];

  return (
    <div role="status">
      <Icons.Spinner iconSize={iconSize} />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

const AppButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant,
      size,
      children,
      loading,
      icon,
      rounded,
      disabled,
      iconPosition = "left",
      ...props
    },
    ref
  ) => {
    return (
      <ButtonComponent
        data-button={variant}
        ref={ref}
        variant={variant}
        size={size}
        rounded={rounded}
        disabled={loading || disabled}
        className={cn("gap-1", {
          "flex-row-reverse": iconPosition === "right",
        })}
        type="button"
        {...props}
      >
        {(loading || icon) && (
          <div>{loading ? <LoadingSpinner size={size} /> : icon}</div>
        )}
        <>{children}</>
      </ButtonComponent>
    );
  }
);

AppButton.displayName = "AppButton";

export { AppButton };
