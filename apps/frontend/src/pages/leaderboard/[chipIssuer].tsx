import React, { useState, useEffect, CSSProperties } from "react";
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
  const contributorMsg = `You are #${leaderboardDetails.userPosition} of ${leaderboardDetails.totalContributors} contributors!`;

  return (
    <AppLayout
      withContainer={false}
      showFooter={false}
      back={{
        label: "Back",
        href: "/profile",
      }}
      headerDivider={false}
      header={
        <div>
          <div className="h-[72px] px-3.5 pt-8 pb-4 bg-white justify-between items-center inline-flex">
            <div className="text-[#090909] text-xl font-semibold font-['DM Sans'] leading-tight">
              {tapsMsg}
            </div>
            <div className="w-6 h-6 relative"></div>
          </div>
          <div className="h-[102px] p-4 flex-col justify-center items-start gap-2 inline-flex">
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
    >
      <div
        className="h-[33px] px-4 py-2 bg-white items-center backdrop-blur-lg justify-between items-start inline-flex"
        style={{ width: "100%" } as CSSProperties}
      >
        <div
          className="justify-start items-start gap-3 flex"
          style={{ width: "100%", display: "contents" } as CSSProperties}
        >
          <div className="w-6 flex-col justify-start items-center gap-2 inline-flex">
            <div className="text-[#090909]/40 text-xs font-medium font-['DM Sans'] leading-none">
              #
            </div>
          </div>
          <div className="justify-start items-start gap-2 flex">
            <div className="text-[#090909]/40 text-xs font-medium font-['DM Sans'] leading-none">
              User name
            </div>
          </div>
          <div className="justify-start items-start gap-2 flex">
            <div className="text-right text-[#090909]/40 text-xs font-medium font-['DM Sans'] leading-none">
              Total taps
            </div>
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
          fontStyling: "text-[#090909]/60 font-sm",
          divider: false,
        };

        let username = entry.username;
        const tapCount = entry.tapCount;

        if (position == 1) {
          styling.positionColor = "bg-[#090909]";
          styling.positionTextColor = "text-white";
          styling.fontStyling = "text-[#090909] font-medium";
        }

        if (entry.username == leaderboardDetails.username) {
          styling.positionColor = "bg-[#f74227]";
          styling.positionTextColor = "text-white";
          styling.fontStyling = "text-[#090909] font-medium";
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
            <div
              className="h-6 px-4 justify-between items-center inline-flex"
              style={
                {
                  width: "100%",
                  marginBottom: "4px",
                  marginTop: "4px",
                } as CSSProperties
              }
            >
              <div className="grow shrink basis-0 h-6 justify-start items-center gap-3 flex">
                <div
                  className={`w-10 h-6 px-0.5 py-2 ${styling.positionColor} rounded-[67px] justify-center items-center gap-2 flex`}
                >
                  <div
                    className={`text-center ${styling.positionTextColor} text-[#090909] text-sm font-medium font-['DM Sans'] leading-tight`}
                  >
                    {position}
                  </div>
                </div>
                <div
                  className={`grow shrink basis-0 ${styling.fontStyling} font-['DM Sans'] leading-tight`}
                >
                  {username}
                </div>
                <div className="justify-start items-start gap-[5px] flex">
                  <div
                    className={`text-right ${styling.fontStyling} font-['DM Sans'] leading-tight`}
                  >
                    {tapCount}
                  </div>
                </div>
              </div>
            </div>
            {styling.divider && (
              <div className="h-[0px] border border-black/20"></div>
            )}
          </div>
        );
      })}
    </AppLayout>
  );
};

export default LeaderboardPage;
