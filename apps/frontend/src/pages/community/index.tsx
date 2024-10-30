import {
  CommunityCard,
  CommunityCardProps,
  DisplayedDashboard,
} from "@/components/cards/CommunityCard";
import { DashboardDetail } from "@/components/dashboard/DashboardDetail";
import { Icons } from "@/components/Icons";
import { CursiveLogo } from "@/components/ui/HeaderCover";
import { Tag } from "@/components/ui/Tag";
import { BASE_API_URL } from "@/config";
import ImportGithubButton from "@/features/oauth/ImportGithubButton";
import ImportStravaButton from "@/features/oauth/ImportStravaButton";
import AppLayout from "@/layouts/AppLayout";
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
import { Metadata } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const metadata: Metadata = {
  title: "Community",
};

const ComingSoonCommunityGoals = () => {
  const mocks: CommunityCardProps[] = [
    {
      image: "/images/yoga.png",
      title: "Yoga With Sophie",
      description: "100 hours",
      type: "community",
      totalContributors: 10,
      progressPercentage: 50,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {mocks?.map((mock: CommunityCardProps, index) => {
        return (
          <CommunityCard
            image={mock?.image}
            key={index}
            type="coming-soon"
            title={mock?.title}
            description={mock?.description}
            progressPercentage={mock?.progressPercentage}
            totalContributors={mock?.totalContributors}
          />
        );
      })}
    </div>
  );
};

export default function CommunityPage() {
  const router = useRouter();
  const [leaderboardDetails, setLeaderboardDetails] =
    useState<LeaderboardDetails | null>(null);
  const [leaderboardEntries, setLeaderboardEntries] =
    useState<LeaderboardEntries | null>(null);
  const [stravaLeaderboardDetails, setStravaLeaderboardDetails] =
    useState<LeaderboardDetails | null>(null);
  const [stravaLeaderboardEntries, setStravaLeaderboardEntries] =
    useState<LeaderboardEntries | null>(null);
  const [githubLeaderboardDetails, setGithubLeaderboardDetails] =
    useState<LeaderboardDetails | null>(null);
  const [githubLeaderboardEntries, setGithubLeaderboardEntries] =
    useState<LeaderboardEntries | null>(null);
  const [weekOct27TapLeaderboardDetails, setWeekOct27TapLeaderboardDetails] =
    useState<LeaderboardDetails | null>(null);
  const [weekOct27TapLeaderboardEntries, setWeekOct27TapLeaderboardEntries] =
    useState<LeaderboardEntries | null>(null);
  const [lannaTotalWorkoutDetails, setLannaTotalWorkoutDetails] =
    useState<LeaderboardDetails | null>(null);
  const [lannaTotalWorkoutEntries, setLannaTotalWorkoutEntries] =
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

      const communityIssuer: ChipIssuer = user.chips[0].issuer;

      let details: LeaderboardDetails | null = null;
      let entries: LeaderboardEntries | null = null;
      let stravaDetails: LeaderboardDetails | null = null;
      let stravaEntries: LeaderboardEntries | null = null;
      let githubDetails: LeaderboardDetails | null = null;
      let githubEntries: LeaderboardEntries | null = null;
      let weekOct27TapDetails: LeaderboardDetails | null = null;
      let weekOct27TapEntries: LeaderboardEntries | null = null;
      let lannaTotalWorkoutDetails: LeaderboardDetails | null = null;
      let lannaTotalWorkoutEntries: LeaderboardEntries | null = null;
      try {
        details = await getUserLeaderboardDetails(
          communityIssuer,
          LeaderboardEntryType.TOTAL_TAP_COUNT
        );
        entries = await getTopLeaderboardEntries(
          communityIssuer,
          LeaderboardEntryType.TOTAL_TAP_COUNT
        );
        stravaDetails = await getUserLeaderboardDetails(
          communityIssuer,
          LeaderboardEntryType.STRAVA_PREVIOUS_MONTH_RUN_DISTANCE
        );
        stravaEntries = await getTopLeaderboardEntries(
          communityIssuer,
          LeaderboardEntryType.STRAVA_PREVIOUS_MONTH_RUN_DISTANCE
        );
        githubDetails = await getUserLeaderboardDetails(
          communityIssuer,
          LeaderboardEntryType.GITHUB_LANNA_COMMITS
        );
        githubEntries = await getTopLeaderboardEntries(
          communityIssuer,
          LeaderboardEntryType.GITHUB_LANNA_COMMITS
        );
        weekOct27TapDetails = await getUserLeaderboardDetails(
          communityIssuer,
          LeaderboardEntryType.WEEK_OCT_27_TAP_COUNT
        );
        weekOct27TapEntries = await getTopLeaderboardEntries(
          communityIssuer,
          LeaderboardEntryType.WEEK_OCT_27_TAP_COUNT
        );
        lannaTotalWorkoutDetails = await getUserLeaderboardDetails(
          communityIssuer,
          LeaderboardEntryType.LANNA_TOTAL_WORKOUT_COUNT
        );
        lannaTotalWorkoutEntries = await getTopLeaderboardEntries(
          communityIssuer,
          LeaderboardEntryType.LANNA_TOTAL_WORKOUT_COUNT
        );
      } catch (error) {
        console.error("Error getting user leaderboard info:", error);
        toast.error("Error getting user leaderboard info.");
        router.push("/profile");
        return;
      }
      if (
        !details ||
        !entries ||
        !stravaDetails ||
        !stravaEntries ||
        !githubDetails ||
        !githubEntries ||
        !weekOct27TapDetails ||
        !weekOct27TapEntries ||
        !lannaTotalWorkoutDetails ||
        !lannaTotalWorkoutEntries
      ) {
        toast.error("User leaderboard info not found.");
        router.push("/profile");
        return;
      }

      setLeaderboardDetails(details);
      setLeaderboardEntries(entries);
      setStravaLeaderboardDetails(stravaDetails);
      setStravaLeaderboardEntries(stravaEntries);
      setGithubLeaderboardDetails(githubDetails);
      setGithubLeaderboardEntries(githubEntries);
      setWeekOct27TapLeaderboardDetails(weekOct27TapDetails);
      setWeekOct27TapLeaderboardEntries(weekOct27TapEntries);
      setLannaTotalWorkoutDetails(lannaTotalWorkoutDetails);
      setLannaTotalWorkoutEntries(lannaTotalWorkoutEntries);

      const props: CommunityCardProps[] = [
        {
          image: "/images/runclub.png",
          title: "Lanna Run Club",
          description: `${(stravaDetails.totalValue / 1000).toFixed(
            2
          )} of 1000 km`,
          type: "active",
          position: stravaDetails.userPosition,
          totalContributors: stravaDetails.totalContributors,
          progressPercentage: Math.min(
            100,
            Math.round((stravaDetails.totalValue / (1000 * 1000)) * 100)
          ),
          dashboard: DisplayedDashboard.STRAVA,
        },
        {
          image: "/images/buildclub.png",
          title: "Lanna Builders",
          description: `${githubDetails.totalValue} of 1000 contributions`,
          type: "active",
          position: githubDetails.userPosition,
          totalContributors: githubDetails.totalContributors,
          progressPercentage: Math.min(
            100,
            Math.round((githubDetails.totalValue / 1000) * 100)
          ),
          dashboard: DisplayedDashboard.GITHUB,
        },
        {
          image: "/images/runclub.png",
          title: "Lanna Workouts",
          description: `${lannaTotalWorkoutDetails.totalValue} of 200 workouts`,
          type: "active",
          position: lannaTotalWorkoutDetails.userPosition,
          totalContributors: lannaTotalWorkoutDetails.totalContributors,
          progressPercentage: Math.min(
            100,
            Math.round((lannaTotalWorkoutDetails.totalValue / 200) * 100)
          ),
          dashboard: DisplayedDashboard.LANNA_TOTAL_WORKOUTS,
        },
        {
          image: "/images/week.png",
          title: "Social Graph, Week of 10/27",
          description: `${weekOct27TapDetails.totalValue} of 500 taps`,
          type: "active",
          position: weekOct27TapDetails.userPosition,
          totalContributors: weekOct27TapDetails.totalContributors,
          progressPercentage: Math.min(
            100,
            Math.round((weekOct27TapDetails.totalValue / 500) * 100)
          ),
          dashboard: DisplayedDashboard.WEEKLY_TAPS_OCT_27,
        },
        {
          image: "/images/hand.png",
          title: "Lanna Social Graph",
          description: `${details.totalValue} of 2000 taps`,
          type: "active",
          position: details.userPosition,
          totalContributors: details.totalContributors,
          progressPercentage: Math.min(
            100,
            Math.round((details.totalValue / 2000) * 100)
          ),
          dashboard: DisplayedDashboard.TOTAL,
        },
      ];
      setCardProps(props);
    };

    fetchInfo();
  }, [router]);

  // track if people are using the external links
  const handleLinkClick = async (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: { href: string; label: string }
  ) => {
    e.preventDefault();
    logClientEvent(item.label, {});

    if (item.label === "community-cherry-link") {
      // Redirect to the Cherry OTP API endpoint
      const { user, session } = await storage.getUserAndSession();
      if (
        user &&
        session &&
        session.authTokenValue &&
        session.authTokenExpiresAt > new Date()
      ) {
        window.location.href = `${BASE_API_URL}/lanna/cherry_otp?authToken=${session.authTokenValue}`;
      } else {
        toast.error("Please log in to access Cherry.");
        router.push("/login");
      }
    } else {
      window.open(item.href, "_blank", "noopener,noreferrer");
    }
  };

  if (
    lannaTotalWorkoutDetails &&
    lannaTotalWorkoutEntries &&
    displayedDashboard === DisplayedDashboard.LANNA_TOTAL_WORKOUTS
  ) {
    return (
      <DashboardDetail
        image="/images/runclub_wide.png"
        title="Lanna Workouts"
        description={
          "Check into workouts at Red Dog Gallery, Apex Gym, Sting Hive, or Manasak Muay Thai Gym by tapping Curtis the Connections Elephant upon visiting. Help us reach the Lanna goal of 200 workouts during the month!"
        }
        leaderboardDetails={lannaTotalWorkoutDetails}
        leaderboardEntries={lannaTotalWorkoutEntries}
        goal={200}
        organizer="Cursive"
        organizerDescription="Cryptography for human connection"
        type="active"
        returnToHome={() => setDisplayedDashboard(DisplayedDashboard.NONE)}
        prize={true}
      />
    );
  }

  if (
    weekOct27TapLeaderboardDetails &&
    weekOct27TapLeaderboardEntries &&
    displayedDashboard === DisplayedDashboard.WEEKLY_TAPS_OCT_27
  ) {
    return (
      <DashboardDetail
        image="/images/week-wide.png"
        title="Social Graph, Week of 10/27"
        description={
          <div className="flex flex-col gap-4">
            <span>
              Weekly tapping challenge to grow the Lanna Social Graph.{" "}
              <b>
                The top 5 contributors will win an exclusive Cursive NFC ring!
              </b>
            </span>
            <span>
              Make sure your tapping is natural, we want to incentive evangelism
              of the app experience and genuine connection. Not just tapping for
              the sake of tapping.
            </span>
          </div>
        }
        leaderboardDetails={weekOct27TapLeaderboardDetails}
        leaderboardEntries={weekOct27TapLeaderboardEntries}
        goal={500}
        organizer="Cursive"
        organizerDescription="Cryptography for human connection"
        type="active"
        returnToHome={() => setDisplayedDashboard(DisplayedDashboard.NONE)}
        prize={true}
      />
    );
  }

  if (
    leaderboardDetails &&
    leaderboardEntries &&
    displayedDashboard === DisplayedDashboard.TOTAL
  ) {
    return (
      <DashboardDetail
        image="/images/social-graph-wide.png"
        title="Lanna Social Graph"
        description={`Grow the Lanna Social Graph by tapping NFC wristbands to share socials, organize your contacts, and discover common and complimentary interests!`}
        leaderboardDetails={leaderboardDetails}
        leaderboardEntries={leaderboardEntries}
        goal={2000}
        organizer="Cursive"
        organizerDescription="Cryptography for human connection"
        type="active"
        returnToHome={() => setDisplayedDashboard(DisplayedDashboard.NONE)}
      />
    );
  }

  if (
    stravaLeaderboardDetails &&
    stravaLeaderboardEntries &&
    displayedDashboard === DisplayedDashboard.STRAVA
  ) {
    return (
      <DashboardDetail
        image="/images/runclub_wide.png"
        title="Lanna Run Club"
        description={`Share your Strava running distance to participate in the Lanna Run Club!`}
        leaderboardDetails={{
          ...stravaLeaderboardDetails,
          totalValue: stravaLeaderboardDetails.totalValue / 1000,
        }}
        leaderboardEntries={{
          entries: stravaLeaderboardEntries.entries.map((entry) => ({
            ...entry,
            entryValue: entry.entryValue / 1000,
          })),
        }}
        goal={1000}
        organizer="Cursive"
        organizerDescription="Cryptography for human connection"
        actionItem={
          <div onClick={() => logClientEvent("community-strava-clicked", {})}>
            <ImportStravaButton />
          </div>
        }
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
        title="Lanna Builders"
        description={`Share your open source GitHub contributions with the Lanna Builder community!`}
        leaderboardDetails={githubLeaderboardDetails}
        leaderboardEntries={githubLeaderboardEntries}
        goal={1000}
        organizer="Cursive"
        organizerDescription="Cryptography for human connection"
        actionItem={
          <div onClick={() => logClientEvent("community-github-clicked", {})}>
            <ImportGithubButton />
          </div>
        }
        type="active"
        returnToHome={() => setDisplayedDashboard(DisplayedDashboard.NONE)}
      />
    );
  }

  return (
    <>
      <NextSeo title="Community" />
      <AppLayout
        header={
          <>
            <span className="text-primary font-medium">Community</span>
            <div
              className="absolute left-0 right-0 bottom-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, #7A74BC 0%, #FF9DF8 39%, #FB5D42 71%, #F00 100%)`,
              }}
            ></div>
          </>
        }
      >
        <div className="flex  overflow-x-scroll gap-2 py-4">
          {[
            {
              href: "https://app.sola.day/event/edgecitylanna/",
              emoji: <Icons.SocialLayer size={18} />,
              text: "Social Layer",
              label: "community-social-layer-link",
            },
            {
              href: "https://lannaedges.radicalxchange.org/",
              emoji: <span className="text-[16px]">∈</span>,
              text: "Edges",
              label: "community-edges-link",
            },
            {
              href: "https://cherry.builders/",
              emoji: "🍒",
              text: "Cherry",
              label: "community-cherry-link",
            },
          ].map((item, index) => (
            <Link
              key={index}
              className="min-w-max"
              href={item.href}
              onClick={(e) => handleLinkClick(e, item)}
            >
              <Tag
                emoji={item.emoji}
                variant="gray"
                text={item.text}
                external
              />
            </Link>
          ))}
        </div>
        {!leaderboardDetails || !leaderboardEntries ? (
          <div className="flex justify-center items-center pt-4">
            <CursiveLogo isLoading />
          </div>
        ) : (
          <div className="flex flex-col gap-6 pt-2 pb-6">
            <div className="flex flex-col gap-2">
              <span className="text-base font-bold text-primary font-sans">
                {`Contribute now!`}
              </span>
              {cardProps?.map((prop: CommunityCardProps, index) => {
                return (
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
              <span className="text-base font-bold text-primary font-sans">
                Coming soon!
              </span>
              <ComingSoonCommunityGoals />
            </div>
          </div>
        )}
      </AppLayout>
    </>
  );
}
