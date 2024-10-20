import { cn } from "@/lib/frontend/util";
import Image from "next/image";
import { useEffect, useState } from "react";

export interface CommunityCardProps {
  image?: string;
  title: string;
  description?: string;
  totalContributors?: number;
  position?: number;
  type: "active" | "community" | "coming-soon";
  progressPercentage?: number;
}

export const CommunityCard = ({
  image = undefined,
  title,
  description,
  totalContributors = 0,
  position = undefined,
  type = "active",
  progressPercentage = 0,
}: CommunityCardProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(progressPercentage);
    }, 500);
    return () => clearTimeout(timer);
  }, [progressPercentage]);

  return (
    <div
      className={cn(
        "w-full bg-white rounded-lg border border-primary",
        type === "coming-soon" && "bg-gray-100 border-gray-200"
      )}
    >
      <div className="p-2 flex items-center gap-[10px]">
        <div className="flex-shrink-0">
          {image ? (
            <Image
              src={image}
              alt={`${image} ${title}`}
              width={80}
              height={80}
              className="w-20 h-20 rounded-lg object-cover"
            />
          ) : (
            <div className="size-20 bg-gray-200 rounded-lg"></div>
          )}
        </div>
        <div className="flex flex-col flex-1">
          <p className="text-xs font-normal text-quaternary">{`${
            (position ?? 0) > 0 ? `#${position} of ` : ""
          } ${totalContributors} contributors`}</p>
          <h2 className="text-sm font-bold text-primary">{title}</h2>
          <div className="w-full bg-[#f1f1f1] rounded-full h-[7px] mt-2 mb-1 overflow-hidden">
            <div
              className={cn(
                "h-[7px] rounded-full transition-all duration-1000 ease-out",
                type === "active"
                  ? "bg-active-progress"
                  : "bg-community-progress"
              )}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          {description && (
            <p className="text-xs font-bold text-quaternary">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};
