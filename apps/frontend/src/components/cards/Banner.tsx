import useSettings from "@/hooks/useSettings";
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
  const { darkTheme } = useSettings();
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-2 p-4 rounded-lg bg-gradient-banner",
        textCenter && "text-center",
        italic && "italic",
        className
      )}
    >
      <span
        className={cn(
          "text-base font-bold ",
          !darkTheme ? "text-black" : "text-label-secondary"
        )}
      >
        {title}
      </span>
      {description && (
        <span
          className={cn(
            "text-base font-normal",
            !darkTheme ? "text-black" : "text-label-secondary"
          )}
        >
          {description}
        </span>
      )}
    </div>
  );
};
