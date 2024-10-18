import { cn } from "@/lib/frontend/util";
import { ReactNode } from "react";

interface BannerProps {
  title?: ReactNode;
  description?: ReactNode;
  className?: ReactNode;
  textCenter?: boolean;
  italic?: boolean;
}
export const Banner = ({
  title,
  description,
  className,
  textCenter = true,
  italic = true,
}: BannerProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-2 p-4 rounded-lg bg-gradient-banner",
        textCenter && "text-center",
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
