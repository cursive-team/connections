import { classed } from "@tw-classed/react";

interface FeedContentProps {
  title: React.ReactNode;
  titleOverride?: boolean;
  description: string;
  icon: React.ReactNode;
}
export const IconCircle = classed.div(
  "flex justify-center items-center h-6 w-6 rounded-full text-label-primary",
  {
    variants: {
      color: {
        primary: "bg-button-secondary",
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
}: FeedContentProps) => {
  return (
    <div className="grid grid-cols-[1fr_60px] items-center justify-between py-1 gap-4">
      <div className="grid grid-cols-[24px_1fr] items-center gap-2 truncate">
        <IconCircle>{icon}</IconCircle>
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
      <span className="text-xs font-medium leading-4 text-label-tertiary font-sans ">
        {description}
      </span>
    </div>
  );
};
