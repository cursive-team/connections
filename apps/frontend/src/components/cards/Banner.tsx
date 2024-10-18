import { cn } from "@/lib/frontend/util";
import { ReactNode } from "react";

interface BannerProps {
  title?: ReactNode;
  description?: ReactNode;
  className?: ReactNode;
  italic?: boolean;
}
export const Banner = ({
  title,
  description,
  className,
  italic = true,
}: BannerProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-2 p-4 rounded-lg bg-gradient-banner text-center",
        italic && "italic",
        className
      )}
    >
      <span className=" text-base font-bold text-secondary">{title}</span>
      {description && (
        <span className=" text-base font-normal text-secondary">
          {description}
        </span>
      )}
    </div>
  );
};
