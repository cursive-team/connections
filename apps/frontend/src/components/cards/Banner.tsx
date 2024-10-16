import { cn } from "@/lib/frontend/util";
import { ReactNode } from "react";

interface BannerProps {
  title?: ReactNode;
  description?: ReactNode;
  className?: ReactNode;
}
export const Banner = ({ title, className }: BannerProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-col p-4 rounded-lg bg-gradient-banner",
        className
      )}
    >
      <span className="italic text-base font-bold text-secondary">{title}</span>
    </div>
  );
};
