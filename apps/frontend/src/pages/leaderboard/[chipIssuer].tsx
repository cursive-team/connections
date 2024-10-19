import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import AppLayout from "@/layouts/AppLayout";
import { CursiveLogo } from "@/components/ui/HeaderCover";
import {
  LeaderboardEntries,
  LeaderboardEntry,
  ChipIssuerSchema,
  LeaderboardDetails,
} from "@types";

import {
  getTopLeaderboardEntries,
  getUserLeaderboardDetails,
} from "@/lib/chip";
import { communitiesEnum, communitiesHumanReadable } from "../../constants";
import { Icons } from "@/components/Icons";

const LeaderboardPage: React.FC = () => {
  const router = useRouter();
  const { chipIssuer } = router.query;
  const [leaderboardDetails, setLeaderboardDetails] =
    useState<LeaderboardDetails | null>(null);
  const [leaderboardEntries, setLeaderboardEntries] =
    useState<LeaderboardEntries | null>(null);
  const [communityName, setCommunityName] = useState<string | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      if (typeof chipIssuer == "string") {
        if (!Object.keys(communitiesEnum).includes(chipIssuer)) {
          toast.error("Invalid chip issuer.");
          router.push("/");
          return;
        }

        const chipIssuerMapping = communitiesEnum[chipIssuer];
        const chipIssuerEnum = ChipIssuerSchema.parse(chipIssuerMapping);

        let details: LeaderboardDetails | null = null;
        try {
          details = await getUserLeaderboardDetails(chipIssuerEnum);
        } catch (error) {
          console.error("Error getting user leaderboard details:", error);
          toast.error("Error getting user leaderboard details.");
          router.push("/");
          return;
        }
        if (!details) {
          toast.error("User leaderboard details not found.");
          router.push("/");
          return;
        }

        let entries: LeaderboardEntries | null = null;
        try {
          entries = await getTopLeaderboardEntries(chipIssuerEnum);
        } catch (error) {
          console.error("Error getting top leaderboard entries:", error);
          toast.error("Error getting top leaderboard entries.");
          router.push("/");
          return;
        }
        if (!entries) {
          toast.error("Top leaderboard entries not found.");
          router.push("/");
          return;
        }

        setCommunityName(communitiesHumanReadable[chipIssuer]);
        setLeaderboardDetails(details);
        setLeaderboardEntries(entries);
      }
    };

    fetchInfo();
  }, [chipIssuer, router]);

  if (!leaderboardDetails || !leaderboardEntries || !communityName) {
    return (
      <div className="flex min-h-screen justify-center items-center text-center">
        <CursiveLogo isLoading />
      </div>
    );
  }

  // variables needed to handle ties
  let lastTapCount = -1;
  let tiedPosition = -1;

  const tapsMsg = `Taps (${leaderboardDetails.totalTaps})`;
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
          <div className="flex flex-row w-full px-1 pt-8 pb-4 bg-white justify-between items-center inline-flex">
            <div className="text-[#090909] text-xl font-semibold font-['DM Sans'] leading-tight">
              {tapsMsg}
            </div>
            <div className="ml-auto">
              <Icons.XClose size={24} onClick={() => router.push("/")} />
            </div>
          </div>
          <div className="py-4 px-1 flex-col justify-center items-start gap-2 inline-flex">
            <div className="text-[#090909] text-base font-bold font-['DM Sans'] leading-snug">
              {contributorMsg}
            </div>
            <div className="self-stretch text-[#090909]/50 text-sm font-normal font-['DM Sans'] leading-tight">
              Win an NFC ring by ranking in the top 10 this week! Winners are
              announced at Sunday dinner.
            </div>
          </div>
        </div>
      }
      className="pb-8"
    >
      <div className="px-4 py-2 bg-white items-center justify-between items-start inline-flex w-full">
        <div className="grid grid-cols-[40px_1fr_1fr] justify-start items-start gap-3 flex w-full">
          <div className="text-[#090909]/40 text-xs text-center font-medium leading-[140%]">
            #
          </div>
          <div className="text-[#090909]/40 text-xs font-medium leading-[140%]">
            User name
          </div>
          <div className="text-right text-[#090909]/40 text-xs font-medium leading-[140%]">
            Total taps
          </div>
        </div>
      </div>

      {leaderboardEntries.entries.map((entry: LeaderboardEntry, index) => {
        let position = index + 1;

        // Handle ties
        if (entry.tapCount == lastTapCount) {
          // If equal, use tiedPosition (which is the first position, not last, of the tied entries)
          position = tiedPosition;
        } else {
          // If not equal, update tiedPosition
          tiedPosition = position;
        }

        // Update lastTapCount
        lastTapCount = entry.tapCount;

        const styling = {
          positionColor: "bg-black/20",
          positionTextColor: "",
          fontStyling: "text-[#090909]/60 text-[14px] font-normal",
          divider: false,
        };

        if (index > 9) {
          styling.fontStyling = "text-[#090909]/40 text-[14px] font-normal";
        }

        let username = entry.username;
        const tapCount = entry.tapCount;

        if (position == 1) {
          styling.positionColor = "bg-[#090909]";
          styling.positionTextColor = "text-white";
          styling.fontStyling = "text-[#090909] text-[16px] font-medium";
        }

        if (entry.username == leaderboardDetails.username) {
          styling.positionColor = "bg-[#FF9DF8]";
          styling.positionTextColor = "text-black";
          styling.fontStyling = "text-[#090909] text-[16px]font-medium";
          username += " (me)";

          if (leaderboardDetails.userPosition != tiedPosition) {
            // Update position if you're tied with another user
            leaderboardDetails.username = entry.username;
            leaderboardDetails.userPosition = tiedPosition;

            setLeaderboardDetails(leaderboardDetails);
          }
        }

        // TODO: Add query check for connection, if we navigated to the leaderboard from a connection's profile

        if (index == 9) {
          styling.divider = true;
        }

        return (
          <div key={index}>
            <div className="h-6 px-4 justify-between items-center inline-flex w-full mb-1 mt-1">
              <div className="grow shrink basis-0 justify-start items-center gap-3 flex">
                <div
                  className={`w-10 h-6 px-1 py-2 ${styling.positionColor} rounded-[67px] justify-center items-center gap-2 flex`}
                >
                  <div
                    className={`text-center ${styling.positionTextColor} text-sm font-medium font-['DM Sans'] leading-[140%]`}
                  >
                    {position}
                  </div>
                </div>
                <div
                  className={`grow shrink basis-0 ${styling.fontStyling} font-['DM Sans'] leading-[140%]`}
                >
                  {username}
                </div>
                <div className="justify-start items-start gap-[5px] flex">
                  <div
                    className={`text-right ${styling.fontStyling} font-['DM Sans'] leading-[140%]`}
                  >
                    {tapCount}
                  </div>
                </div>
              </div>
            </div>
            {styling.divider && (
              <div className="py-2">
                <div className="h-[0px] border border-black/20"></div>
              </div>
            )}
          </div>
        );
      })}
    </AppLayout>
  );
};

export default LeaderboardPage;
