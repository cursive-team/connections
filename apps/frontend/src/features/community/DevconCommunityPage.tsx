import {
  CommunityCard,
  CommunityCardProps,
  DisplayedDashboard,
} from "@/components/cards/CommunityCard";
import { DashboardDetail } from "@/components/dashboard/DashboardDetail";
import { StoreBanner } from "@/components/StoreBanner";
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

export default function DevconCommunityPage({
  displayedDashboard,
  setDisplayedDashboard,
}: {
  displayedDashboard: DisplayedDashboard;
  setDisplayedDashboard: (dashboard: DisplayedDashboard) => void;
}) {
  const router = useRouter();
  const [leaderboardTapDetails, setLeaderboardTapDetails] =
    useState<LeaderboardDetails | null>(null);
  const [leaderboardTapEntries, setLeaderboardTapEntries] =
    useState<LeaderboardEntries | null>(null);

  const [leaderboardOnboardingDetails, setLeaderboardOnboardingDetails] =
    useState<LeaderboardDetails | null>(null);
  const [leaderboardOnboardingEntries, setLeaderboardOnboardingEntries] =
    useState<LeaderboardEntries | null>(null);

  const [cardProps, setCardProps] = useState<CommunityCardProps[]>([]);

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

      let totalOnboardingDetails: LeaderboardDetails | null = null;
      let totalOnboardingEntries: LeaderboardEntries | null = null;

      try {
        [totalTapDetails, totalTapEntries] = await Promise.all([
          getUserLeaderboardDetails(
            communityIssuer,
            LeaderboardEntryType.DEVCON_2024_TAP_COUNT
          ),
          getTopLeaderboardEntries(
            communityIssuer,
            LeaderboardEntryType.DEVCON_2024_TAP_COUNT
          ),
        ]);

        [totalOnboardingDetails, totalOnboardingEntries] = await Promise.all([
          getUserLeaderboardDetails(
            communityIssuer,
            LeaderboardEntryType.USER_REGISTRATION_ONBOARDING
          ),
          getTopLeaderboardEntries(
            communityIssuer,
            LeaderboardEntryType.USER_REGISTRATION_ONBOARDING
          ),
        ]);
      } catch (error) {
        console.error("Error getting user leaderboard info:", error);
        toast.error("Error getting user leaderboard info.");
        router.push("/profile");
        return;
      }

      if (!totalTapDetails || !totalTapEntries) {
        toast.error("User tap leaderboard info not found.");
        router.push("/profile");
        return;
      }

      if (!totalOnboardingDetails || !totalOnboardingEntries) {
        toast.error("User onboarding leaderboard info not found.");
        router.push("/profile");
        return;
      }

      setLeaderboardTapDetails(totalTapDetails);
      setLeaderboardTapEntries(totalTapEntries);

      setLeaderboardOnboardingDetails(totalOnboardingDetails);
      setLeaderboardOnboardingEntries(totalOnboardingEntries);

      const props: CommunityCardProps[] = [
        {
          image: "/images/hand.png",
          title: "coSNARK Tap Leaderboard 🏆",
          description: `${totalTapDetails.totalValue} of 2000 taps`,
          type: "active",
          position: totalTapDetails.userPosition,
          totalContributors: totalTapDetails.totalContributors,
          progressPercentage: Math.min(
            100,
            Math.round((totalTapDetails.totalValue / 2000) * 100)
          ),
          dashboard: DisplayedDashboard.DEVCON_2024_TAP_COUNT,
        },
        {
          image: "/images/week.png",
          title: "User Onboarding Dashboard",
          description: `${totalOnboardingDetails.totalValue} of 100 Onboardings`,
          type: "active",
          position: totalOnboardingDetails.userPosition,
          totalContributors: totalOnboardingDetails.totalContributors,
          progressPercentage: Math.min(
            100,
            Math.round((totalOnboardingDetails.totalValue / 100) * 100)
          ),
          dashboard: DisplayedDashboard.USER_REGISTRATION_ONBOARDING,
        },
      ];


      setCardProps(props);
    };

    fetchInfo();
  }, [router]);

  if (
    leaderboardTapDetails &&
    leaderboardTapEntries &&
    displayedDashboard === DisplayedDashboard.DEVCON_2024_TAP_COUNT
  ) {
    return (
      <DashboardDetail
        image="/images/social-graph-wide.png"
        title="coSNARK Tap Leaderboard 🏆"
        description={
          <>
            <span>
              Grow the Devcon Social Graph by tapping NFC chips to share socials
              and discover common and complimentary interests!
            </span>
            <br />
            <br />
            <span>
              Each tap is privately verified with Collaborative SNARKs built by{" "}
              <a
                href="https://taceo.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-link-primary"
              >
                TACEO
              </a>
              . Secret shares of your data is split between Cursive,{" "}
              <a
                href="https://taceo.io/"
                target="_blank"
                rel="noopener noreferrer"
              >
                TACEO
              </a>
              , and{" "}
              <a
                href="https://pse.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-link-primary"
              >
                PSE
              </a>{" "}
              servers, who work together to generate a proof you have a valid
              tap. This means you can delegate ZK proving without sacrificing
              privacy!
            </span>
          </>
        }
        leaderboardDetails={leaderboardTapDetails}
        leaderboardEntries={leaderboardTapEntries}
        goal={2000}
        unit="tap"
        organizer="Cursive"
        organizerDescription="Cryptography for human connection"
        type="active"
        returnToHome={() => setDisplayedDashboard(DisplayedDashboard.NONE)}
      />
    );
  }

  if (
    leaderboardOnboardingDetails &&
    leaderboardOnboardingEntries &&
    displayedDashboard === DisplayedDashboard.USER_REGISTRATION_ONBOARDING
  ) {
    return (
      <DashboardDetail
        image="/images/week-wide.png"
        title="User Onboarding Dashboard"
        description={
          <>
            <span>
              Bring your friends into the Cursive community! Tap them before registration, guide them through the registration process, and get credit for onboarding.
            </span>
          </>
        }
        leaderboardDetails={leaderboardOnboardingDetails}
        leaderboardEntries={leaderboardOnboardingEntries}
        goal={100}
        unit="invites"
        organizer="Cursive"
        organizerDescription="Cryptography for human connection"
        type="active"
        returnToHome={() => setDisplayedDashboard(DisplayedDashboard.NONE)}
      />
    );
  }

  return (
    <>
      <div className="py-3">
        <StoreBanner />
      </div>
      {!leaderboardTapDetails || !leaderboardTapEntries || !leaderboardOnboardingDetails || !leaderboardOnboardingEntries ? (
        <div className="flex justify-center items-center pt-4">
          <CursiveLogo isLoading />
        </div>
      ) : (
        <div className="flex flex-col gap-6 pt-2 pb-6">
          <div className="flex flex-col gap-2">
            <span className="text-base font-bold text-label-primary font-sans">
              {`Dashboards`}
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
        </div>
      )}
    </>
  );
}
