import { Icons } from "@/components/Icons";
import { AppButton } from "@/components/ui/Button";
import { CursiveLogo } from "@/components/ui/HeaderCover";
import AppLayout from "@/layouts/AppLayout";
import { cn } from "@/lib/frontend/util";
import { LeaderboardDetails, LeaderboardEntries } from "@types";
import { useState, useEffect } from "react";
import { Leaderboard } from "./Leaderboard";
import { IoIosArrowBack as BackIcon } from "react-icons/io";
import { logClientEvent } from "@/lib/frontend/metrics";

interface DashboardDetailProps {
  image: string;
  title: string;
  description: React.ReactNode;
  leaderboardEntries: LeaderboardEntries;
  leaderboardDetails: LeaderboardDetails;
  goal: number;
  organizer: string;
  organizerDescription: string;
  actionItem?: React.ReactNode;
  type?: "active" | "community";
  prize?: boolean;
  prizeRank?: number;
  returnToHome: () => void;
}

export function DashboardDetail({
  image,
  title,
  description,
  leaderboardEntries,
  leaderboardDetails,
  goal,
  organizer,
  organizerDescription,
  actionItem,
  type = "active",
  prize = false,
  prizeRank,
  returnToHome,
}: DashboardDetailProps) {
  const [progress, setProgress] = useState(0);
  const [seeFullLeaderboard, setSeeFullLeaderboard] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(
        Math.min(100, Math.round((leaderboardDetails.totalValue / goal) * 100))
      );
    }, 500);
    return () => clearTimeout(timer);
  }, [leaderboardDetails, goal]);

  if (seeFullLeaderboard) {
    let contributorMsg = `You are #${leaderboardDetails.userPosition} of ${leaderboardDetails.totalContributors} contributors!`;

    if (leaderboardDetails.userPosition == -1) {
      contributorMsg = "You are not on the leaderboard yet.";
    }

    return (
      <AppLayout
        withContainer={false}
        showFooter={false}
        header={
          <div>
            <div className="flex-row w-full px-1 pt-8 pb-4 bg-white justify-between items-center inline-flex">
              <div className="text-[#090909] text-xl font-semibold font-['DM Sans'] leading-tight">
                {`Total (${
                  Number.isInteger(leaderboardDetails.totalValue)
                    ? leaderboardDetails.totalValue
                    : leaderboardDetails.totalValue.toFixed(2)
                })`}
              </div>
              <div className="ml-auto">
                <Icons.XClose
                  size={24}
                  onClick={() => setSeeFullLeaderboard(false)}
                />
              </div>
            </div>
            <div className="py-4 px-1 flex-col justify-center items-start gap-2 inline-flex">
              <div className="text-[#090909] text-base font-bold font-['DM Sans'] leading-snug">
                {contributorMsg}
              </div>
              {prize && (
                <>
                  <div className="self-stretch text-[#090909]/50 text-sm font-normal font-['DM Sans'] leading-tight">
                    Win an NFC ring by ranking in the top {prizeRank} this week!
                    Winners are announced at Sunday dinner.
                  </div>
                  <div className="self-stretch text-[#090909]/50 text-sm font-normal font-['DM Sans'] leading-tight">
                    People who already have a ring are marked with a 💍.
                    {prize && ` They do not count in the top ${prizeRank}.`}
                  </div>
                </>
              )}
            </div>
          </div>
        }
        className="pb-8"
      >
        <Leaderboard
          leaderboardEntries={{
            entries: leaderboardEntries.entries.slice(0, 100),
          }}
          leaderboardDetails={leaderboardDetails}
          prize={prize}
          markedRank={prizeRank}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout
      seoTitle=""
      showFooter={false}
      withContainer={false}
      headerDivider
      header={
        <div className="sticky top-0 h-12 flex items-center bg-white z-20">
          <div className="px-1">
            <div className="flex gap-1 items-center" onClick={returnToHome}>
              <BackIcon size={12} />
              <span className="text-sm">Back</span>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col divide-y divide-y-quaternary">
        <div className="flex flex-col gap-4 p-4">
          <div
            className="rounded-lg overflow-hidden h-[135px] w-full bg-gray-200"
            style={
              image
                ? {
                    backgroundSize: "100% auto",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundImage: `url(${image})`,
                  }
                : {}
            }
          ></div>
          <div className="flex flex-col flex-1 gap-2">
            <p className="text-xs font-normal text-quaternary">{`${
              (leaderboardDetails.userPosition ?? 0) > 0
                ? `#${leaderboardDetails.userPosition} of `
                : ""
            } ${leaderboardDetails.totalContributors} contributors`}</p>
            <h2 className="text-xl font-bold leading-none text-primary">
              {title}
            </h2>
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
          </div>
        </div>
        {description && (
          <div className="w-full p-4">
            <p className="text-sm font-normal text-primary text-left">
              {description}
            </p>
            {actionItem && (
              <div className="flex justify-center w-full mt-4">
                {actionItem}
              </div>
            )}
          </div>
        )}
        <div className="pb-6">
          <div className="flex flex-col gap-2 p-4">
            <div className=" items-center flex justify-between">
              <span className="text-base font-bold text-primary font-sans">
                Top 5 contributors
              </span>
              <AppButton
                variant="outline"
                className="rounded-full max-w-[120px]"
                icon={<Icons.Star className="mr-2" />}
                onClick={() => {
                  logClientEvent("dashboard-leaderboard-clicked", {
                    title,
                  });
                  setSeeFullLeaderboard(true);
                }}
              >
                See all
              </AppButton>
            </div>
          </div>
          <div>
            <Leaderboard
              leaderboardEntries={{
                entries: leaderboardEntries.entries.slice(0, 5),
              }}
              leaderboardDetails={leaderboardDetails}
            />
          </div>
        </div>

        <div className="p-4">
          <div className="flex flex-col gap-2">
            <span className="text-base font-bold text-primary font-sans">
              Organizer
            </span>
            <div className="flex items-start gap-4 py-4">
              <CursiveLogo size={48} />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-primary font-sans">
                  {organizer}
                </span>
                <span className="text-xs font-medium text-secondary font-sans">
                  {organizerDescription}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
