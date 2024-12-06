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
import { User } from "@/lib/storage/types";
import ImportGithubButton from "@/features/oauth/ImportGithubButton";

export default function EthIndiaCommunityPage({
  displayedDashboard,
  setDisplayedDashboard,
}: {
  displayedDashboard: DisplayedDashboard;
  setDisplayedDashboard: (dashboard: DisplayedDashboard) => void;
}) {
  const router = useRouter();

  const [user, setUser] = useState<User | undefined>(undefined);

  const [leaderboardTapDetails, setLeaderboardTapDetails] =
    useState<LeaderboardDetails | null>(null);
  const [leaderboardTapEntries, setLeaderboardTapEntries] =
    useState<LeaderboardEntries | null>(null);

  const [leaderboardOnboardingDetails, setLeaderboardOnboardingDetails] =
    useState<LeaderboardDetails | null>(null);
  const [leaderboardOnboardingEntries, setLeaderboardOnboardingEntries] =
    useState<LeaderboardEntries | null>(null);

  const [githubLeaderboardDetails, setGithubLeaderboardDetails] =
    useState<LeaderboardDetails | null>(null);
  const [githubLeaderboardEntries, setGithubLeaderboardEntries] =
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

      const communityIssuer: ChipIssuer = ChipIssuer.ETH_INDIA_2024;

      let fetchedUser: User | undefined = undefined;
      let totalTapDetails: LeaderboardDetails | null = null;
      let totalTapEntries: LeaderboardEntries | null = null;
      let githubDetails: LeaderboardDetails | null = null;
      let githubEntries: LeaderboardEntries | null = null;

      let totalOnboardingDetails: LeaderboardDetails | null = null;
      let totalOnboardingEntries: LeaderboardEntries | null = null;

      try {
        [
          fetchedUser,
          totalTapDetails,
          totalTapEntries,
          githubDetails,
          githubEntries,
        ] = await Promise.all([
          storage.getUser(),
          getUserLeaderboardDetails(
            communityIssuer,
            LeaderboardEntryType.ETHINDIA_2024_TAP_COUNT
          ),
          getTopLeaderboardEntries(
            communityIssuer,
            LeaderboardEntryType.ETHINDIA_2024_TAP_COUNT
          ),
          getUserLeaderboardDetails(
            communityIssuer,
            LeaderboardEntryType.GITHUB_CONTRIBUTIONS_LAST_YEAR
          ),
          getTopLeaderboardEntries(
            communityIssuer,
            LeaderboardEntryType.GITHUB_CONTRIBUTIONS_LAST_YEAR
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

      if (
        !fetchedUser ||
        !totalTapDetails ||
        !totalTapEntries ||
        !githubDetails ||
        !githubEntries
      ) {
        toast.error("User leaderboard info not found.");
        router.push("/profile");
        return;
      }

      if (!totalOnboardingDetails || !totalOnboardingEntries) {
        toast.error("User onboarding leaderboard info not found.");
        router.push("/profile");
        return;
      }

      setUser(fetchedUser);

      setLeaderboardTapDetails(totalTapDetails);
      setLeaderboardTapEntries(totalTapEntries);

      setLeaderboardOnboardingDetails(totalOnboardingDetails);
      setLeaderboardOnboardingEntries(totalOnboardingEntries);

      setGithubLeaderboardDetails(githubDetails);
      setGithubLeaderboardEntries(githubEntries);

      const props: CommunityCardProps[] = [
        {
          image: "/images/week.png",
          title: "User Onboarding Leaderboard 🤝",
          description: `${totalOnboardingDetails.totalValue} of 100 onboardings`,
          type: "active",
          position: totalOnboardingDetails.userPosition,
          totalContributors: totalOnboardingDetails.totalContributors,
          progressPercentage: Math.min(
            100,
            Math.round((totalOnboardingDetails.totalValue / 100) * 100)
          ),
          dashboard: DisplayedDashboard.USER_REGISTRATION_ONBOARDING,
        },
        {
          image: "/images/buildclub.png",
          title: "GitHub Commit Leaderboard 👩‍💻",
          description: `${githubDetails.totalValue} of 2000 contributions`,
          type: "active",
          position: githubDetails.userPosition,
          totalContributors: githubDetails.totalContributors,
          progressPercentage: Math.min(
            100,
            Math.round((githubDetails.totalValue / 2000) * 100)
          ),
          dashboard: DisplayedDashboard.GITHUB,
        },
        {
          image: "/images/hand.png",
          title: "Tap Leaderboard 🏆",
          description: `${totalTapDetails.totalValue} of 500 taps`,
          type: "active",
          position: totalTapDetails.userPosition,
          totalContributors: totalTapDetails.totalContributors,
          progressPercentage: Math.min(
            100,
            Math.round((totalTapDetails.totalValue / 500) * 100)
          ),
          dashboard: DisplayedDashboard.ETHINDIA_2024_TAP_COUNT,
        },
      ];

      setCardProps(props);
    };

    fetchInfo();
  }, [router]);

  if (
    leaderboardTapDetails &&
    leaderboardTapEntries &&
    displayedDashboard === DisplayedDashboard.ETHINDIA_2024_TAP_COUNT
  ) {
    return (
      <DashboardDetail
        image="/images/social-graph-wide.png"
        title="Tap Leaderboard 🏆"
        description={
          <>
            <span>
              Grow the ETHIndia Social Graph by tapping NFC chips to share
              socials and discover common and complementary interests!
            </span>
          </>
        }
        leaderboardDetails={leaderboardTapDetails}
        leaderboardEntries={leaderboardTapEntries}
        goal={500}
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
        title="User Onboarding Leaderboard 🤝"
        description={
          <>
            <span>
              Bring your friends into the Cursive community! Tap them before
              registration, guide them through the registration process, and get
              credit for onboarding.
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

  if (
    githubLeaderboardDetails &&
    githubLeaderboardEntries &&
    displayedDashboard === DisplayedDashboard.GITHUB
  ) {
    return (
      <DashboardDetail
        image="/images/buildclub_wide.png"
        title="Hacker Club 👩‍💻"
        description={`Share your open source GitHub contributions over the last year with the Builder community!`}
        leaderboardDetails={githubLeaderboardDetails}
        leaderboardEntries={githubLeaderboardEntries}
        goal={2000}
        unit="contribution"
        organizer="Cursive"
        organizerDescription="Cryptography for human connection"
        actionItem={
          user &&
          (!user.oauth ||
            (user.oauth && !Object.keys(user?.oauth).includes("github"))) && (
            <div
              className="w-full"
              onClick={() => logClientEvent("community-github-clicked", {})}
            >
              <ImportGithubButton fullWidth />
            </div>
          )
        }
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
      {!leaderboardTapDetails ||
      !leaderboardTapEntries ||
      !leaderboardOnboardingDetails ||
      !leaderboardOnboardingEntries ? (
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
