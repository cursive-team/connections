"use client";
import useSettings from "@/hooks/useSettings";
import { cn } from "@/lib/frontend/util";
import Image from "next/image";
import { useEffect, useState } from "react";

export enum DisplayedDashboard {
  NONE = "none",
  WEEKLY = "weekly",
  WEEKLY_TAPS_OCT_27 = "weekly-taps-oct-27",
  TOTAL = "total",
  STRAVA = "strava",
  GITHUB = "github",
  LANNA_TOTAL_WORKOUTS = "lanna-total-workouts",
  WEEKLY_TAPS_NOV_4 = "weekly-taps-nov-4",
  DEVCON_2024_TAP_COUNT = "devcon-total-taps",
  DEVCON_2024_DAY_1_TAP_COUNT = "devcon-day-1-taps",
  DEVCON_2024_DAY_2_TAP_COUNT = "devcon-day-2-taps",
  USER_REGISTRATION_ONBOARDING = "user-registration-onboarding",
  ETHINDIA_2024_TAP_COUNT = "ethindia-total-taps",
}

export interface CommunityCardProps {
  image?: string;
  title: string;
  description?: string;
  totalContributors?: number;
  position?: number;
  type: "active" | "community" | "coming-soon";
  progressPercentage?: number;
  dashboard?: DisplayedDashboard;
  past?: boolean;
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
  const { darkTheme } = useSettings();
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
        "w-full rounded-lg border border-primary ",
        darkTheme ? "!border !border-white bg-card-gray" : "bg-white"
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
          <p className="text-xs font-normal text-label-quaternary">{`${
            (position ?? 0) > 0 ? `#${position} of ` : ""
          } ${totalContributors} contributors`}</p>
          <h2 className="text-sm font-bold text-label-primary">{title}</h2>
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
            <p className="text-xs font-bold text-label-quaternary">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
