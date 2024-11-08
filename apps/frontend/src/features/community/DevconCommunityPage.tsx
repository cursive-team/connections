import {
  CommunityCard,
  CommunityCardProps,
  DisplayedDashboard,
} from "@/components/cards/CommunityCard";
import { DashboardDetail } from "@/components/dashboard/DashboardDetail";
import { CursiveLogo } from "@/components/ui/HeaderCover";
import {
  getTopLeaderboardEntries,
  getUserLeaderboardDetails,
} from "@/lib/chip";
import { logClientEvent } from "@/lib/frontend/metrics";
import { storage } from "@/lib/storage";
import {
  ChipIssuer,
  LeaderboardDetails,
  LeaderboardEntries,
  LeaderboardEntryType,
} from "@types";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DevconCommunityPage() {
  const router = useRouter();
  const [leaderboardDetails, setLeaderboardDetails] =
    useState<LeaderboardDetails | null>(null);
  const [leaderboardEntries, setLeaderboardEntries] =
    useState<LeaderboardEntries | null>(null);

  const [cardProps, setCardProps] = useState<CommunityCardProps[]>([]);
  const [displayedDashboard, setDisplayedDashboard] =
    useState<DisplayedDashboard>(DisplayedDashboard.NONE);

  useEffect(() => {
    const fetchInfo = async () => {
      const { user, session } = await storage.getUserAndSession();
      if (!user || !session || session.authTokenExpiresAt < new Date()) {
        toast.error("Please log in to view the leaderboard.");
        router.push("/");
        return;
      }

      const communityIssuer: ChipIssuer = ChipIssuer.DEVCON_2024;

      let totalTapDetails: LeaderboardDetails | null = null;
      let totalTapEntries: LeaderboardEntries | null = null;
      try {
        totalTapDetails = await getUserLeaderboardDetails(
          communityIssuer,
          LeaderboardEntryType.TOTAL_TAP_COUNT
        );
        totalTapEntries = await getTopLeaderboardEntries(
          communityIssuer,
          LeaderboardEntryType.TOTAL_TAP_COUNT
        );
      } catch (error) {
        console.error("Error getting user leaderboard info:", error);
        toast.error("Error getting user leaderboard info.");
        router.push("/profile");
        return;
      }
      if (!totalTapDetails || !totalTapEntries) {
        toast.error("User leaderboard info not found.");
        router.push("/profile");
        return;
      }

      setLeaderboardDetails(totalTapDetails);
      setLeaderboardEntries(totalTapEntries);

      const props: CommunityCardProps[] = [
        {
          image: "/images/hand.png",
          title: "Devcon Social Graph 🌐",
          description: `${totalTapDetails.totalValue} of 2000 taps`,
          type: "active",
          position: totalTapDetails.userPosition,
          totalContributors: totalTapDetails.totalContributors,
          progressPercentage: Math.min(
            100,
            Math.round((totalTapDetails.totalValue / 2000) * 100)
          ),
          dashboard: DisplayedDashboard.DEVCON_TOTAL_TAPS,
        },
      ];
      setCardProps(props);
    };

    fetchInfo();
  }, [router]);

  if (
    leaderboardDetails &&
    leaderboardEntries &&
    displayedDashboard === DisplayedDashboard.DEVCON_TOTAL_TAPS
  ) {
    return (
      <DashboardDetail
        image="/images/social-graph-wide.png"
        title="Devcon Social Graph 🌐"
        description={`Grow the Devcon Social Graph by tapping NFC chips to share socials, organize your contacts, and discover common and complimentary interests!`}
        leaderboardDetails={leaderboardDetails}
        leaderboardEntries={leaderboardEntries}
        goal={2000}
        unit="tap"
        organizer="Cursive"
        organizerDescription="Cryptography for human connection"
        type="active"
        returnToHome={() => setDisplayedDashboard(DisplayedDashboard.NONE)}
      />
    );
  }

  return (
    <>
      {!leaderboardDetails || !leaderboardEntries ? (
        <div className="flex justify-center items-center pt-4">
          <CursiveLogo isLoading />
        </div>
      ) : (
        <div className="flex flex-col gap-6 pt-2 pb-6">
          <div className="flex flex-col gap-2">
            <span className="text-base font-bold text-label-primary font-sans">
              {`Current dashboards`}
            </span>
            {cardProps?.map((prop: CommunityCardProps, index) => {
              return prop.past ? (
                <></>
              ) : (
                <div
                  key={index}
                  onClick={() => {
                    logClientEvent("community-dashboard-clicked", {
                      title: prop?.title,
                    });
                    setDisplayedDashboard(
                      prop?.dashboard || DisplayedDashboard.NONE
                    );
                  }}
                >
                  <CommunityCard
                    image={prop?.image}
                    type="active"
                    title={prop?.title}
                    description={prop?.description}
                    progressPercentage={prop?.progressPercentage}
                    position={prop?.position}
                    totalContributors={prop?.totalContributors}
                    dashboard={prop?.dashboard}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-base font-bold text-label-primary font-sans">
              {`Past dashboards`}
            </span>
            {cardProps?.map((prop: CommunityCardProps, index) => {
              return !prop.past ? (
                <></>
              ) : (
                <div
                  key={index}
                  onClick={() => {
                    logClientEvent("community-dashboard-clicked", {
                      title: prop?.title,
                    });
                    setDisplayedDashboard(
                      prop?.dashboard || DisplayedDashboard.NONE
                    );
                  }}
                >
                  <CommunityCard
                    image={prop?.image}
                    type="active"
                    title={prop?.title}
                    description={prop?.description}
                    progressPercentage={prop?.progressPercentage}
                    position={prop?.position}
                    totalContributors={prop?.totalContributors}
                    dashboard={prop?.dashboard}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
