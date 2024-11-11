import { cn } from "@/lib/frontend/util";
import { classed } from "@tw-classed/react";

interface FeedContentProps {
  className?: string;
  title: React.ReactNode;
  titleOverride?: boolean;
  description: React.ReactNode;
  icon: React.ReactNode;
  color?: string;
}
export const IconCircle = classed.div(
  "flex justify-center items-center h-6 w-6 rounded-full text-label-primary",
  {
    variants: {
      color: {
        primary: "bg-button-secondary",
        transparent: "bg-transparent",
      },
      border: {
        true: "",
      },
    },
    defaultVariants: {
      color: "primary",
    },
  }
);

const CardTitleOverride = classed.h1("text-sm leading-5 font-normal");

export const FeedContent = ({
  title,
  description,
  titleOverride,
  icon,
  className = "",
  color = "primary",
}: FeedContentProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-[1fr_60px] items-center justify-between py-1 gap-4",
        className
      )}
    >
      <div className="grid grid-cols-[24px_1fr] items-center gap-2 truncate">
        <IconCircle color={color as any}>{icon}</IconCircle>
        {titleOverride === true ? (
          <CardTitleOverride className="truncate text-label-primary font-sans font-normal">
            {title}
          </CardTitleOverride>
        ) : (
          <span className="text-sm leading-5 text-label-primary font-normal truncate ">
            {title}
          </span>
        )}
      </div>
      {typeof description === "string" ? (
        <span className="text-xs font-medium leading-4 text-label-tertiary font-sans ">
          {description}
        </span>
      ) : (
        description
      )}
    </div>
  );
};
