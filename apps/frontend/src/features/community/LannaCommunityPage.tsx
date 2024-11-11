import {
  CommunityCard,
  CommunityCardProps,
  DisplayedDashboard,
} from "@/components/cards/CommunityCard";
import { DashboardDetail } from "@/components/dashboard/DashboardDetail";
import { Icons } from "@/components/icons/Icons";
import { CursiveLogo } from "@/components/ui/HeaderCover";
import { Tag } from "@/components/ui/Tag";
import { BASE_API_URL } from "@/config";
import ImportGithubButton from "@/features/oauth/ImportGithubButton";
import ImportStravaButton from "@/features/oauth/ImportStravaButton";
import {
  getTopLeaderboardEntries,
  getUserLeaderboardDetails,
} from "@/lib/chip";
import { logClientEvent } from "@/lib/frontend/metrics";
import { storage } from "@/lib/storage";
import { User } from "@/lib/storage/types";
import {
  ChipIssuer,
  LeaderboardDetails,
  LeaderboardEntries,
  LeaderboardEntryType,
} from "@types";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Mona } from "@/components/icons/Mona";

export default function LannaCommunityPage({
  displayedDashboard,
  setDisplayedDashboard,
}: {
  displayedDashboard: DisplayedDashboard;
  setDisplayedDashboard: (dashboard: DisplayedDashboard) => void;
}) {
  const router = useRouter();
  const [leaderboardDetails, setLeaderboardDetails] =
    useState<LeaderboardDetails | null>(null);
  const [leaderboardEntries, setLeaderboardEntries] =
    useState<LeaderboardEntries | null>(null);
  const [weeklyLeaderboardDetails, setWeeklyLeaderboardDetails] =
    useState<LeaderboardDetails | null>(null);
  const [weeklyLeaderboardEntries, setWeeklyLeaderboardEntries] =
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
  const [weekNov4TapLeaderboardDetails, setWeekNov4TapLeaderboardDetails] =
    useState<LeaderboardDetails | null>(null);
  const [weekNov4TapLeaderboardEntries, setWeekNov4TapLeaderboardEntries] =
    useState<LeaderboardEntries | null>(null);

  const [cardProps, setCardProps] = useState<CommunityCardProps[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      const { user, session } = await storage.getUserAndSession();
      if (!user || !session || session.authTokenExpiresAt < new Date()) {
        toast.error("Please log in to view the leaderboard.");
        router.push("/");
        return;
      }
      setUser(user);

      // Currently will only be EDGE_CITY_LANNA
      const communityIssuer: ChipIssuer = ChipIssuer.EDGE_CITY_LANNA;

      let details: LeaderboardDetails | null = null;
      let entries: LeaderboardEntries | null = null;
      let weeklyDetails: LeaderboardDetails | null = null;
      let weeklyEntries: LeaderboardEntries | null = null;
      let stravaDetails: LeaderboardDetails | null = null;
      let stravaEntries: LeaderboardEntries | null = null;
      let githubDetails: LeaderboardDetails | null = null;
      let githubEntries: LeaderboardEntries | null = null;
      let weekOct27TapDetails: LeaderboardDetails | null = null;
      let weekOct27TapEntries: LeaderboardEntries | null = null;
      let lannaTotalWorkoutDetails: LeaderboardDetails | null = null;
      let lannaTotalWorkoutEntries: LeaderboardEntries | null = null;
      let weekNov4TapDetails: LeaderboardDetails | null = null;
      let weekNov4TapEntries: LeaderboardEntries | null = null;
      try {
        details = await getUserLeaderboardDetails(
          communityIssuer,
          LeaderboardEntryType.TOTAL_TAP_COUNT
        );
        entries = await getTopLeaderboardEntries(
          communityIssuer,
          LeaderboardEntryType.TOTAL_TAP_COUNT
        );
        weeklyDetails = await getUserLeaderboardDetails(
          communityIssuer,
          LeaderboardEntryType.WEEK_OCT_20_TAP_COUNT
        );
        weeklyEntries = await getTopLeaderboardEntries(
          communityIssuer,
          LeaderboardEntryType.WEEK_OCT_20_TAP_COUNT
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
        weekNov4TapDetails = await getUserLeaderboardDetails(
          communityIssuer,
          LeaderboardEntryType.WEEK_NOV_4_TAP_COUNT
        );
        weekNov4TapEntries = await getTopLeaderboardEntries(
          communityIssuer,
          LeaderboardEntryType.WEEK_NOV_4_TAP_COUNT
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
        !weeklyDetails ||
        !weeklyEntries ||
        !stravaDetails ||
        !stravaEntries ||
        !githubDetails ||
        !githubEntries ||
        !weekOct27TapDetails ||
        !weekOct27TapEntries ||
        !lannaTotalWorkoutDetails ||
        !lannaTotalWorkoutEntries ||
        !weekNov4TapDetails ||
        !weekNov4TapEntries
      ) {
        toast.error("User leaderboard info not found.");
        router.push("/profile");
        return;
      }

      setLeaderboardDetails(details);
      setLeaderboardEntries(entries);
      setWeeklyLeaderboardDetails(weeklyDetails);
      setWeeklyLeaderboardEntries(weeklyEntries);
      setStravaLeaderboardDetails(stravaDetails);
      setStravaLeaderboardEntries(stravaEntries);
      setGithubLeaderboardDetails(githubDetails);
      setGithubLeaderboardEntries(githubEntries);
      setWeekOct27TapLeaderboardDetails(weekOct27TapDetails);
      setWeekOct27TapLeaderboardEntries(weekOct27TapEntries);
      setLannaTotalWorkoutDetails(lannaTotalWorkoutDetails);
      setLannaTotalWorkoutEntries(lannaTotalWorkoutEntries);
      setWeekNov4TapLeaderboardDetails(weekNov4TapDetails);
      setWeekNov4TapLeaderboardEntries(weekNov4TapEntries);

      const props: CommunityCardProps[] = [
        {
          image: "/images/week.png",
          title: "Social Graph, Week of Nov 4 💍",
          description: `${weekNov4TapDetails.totalValue} of 500 taps`,
          type: "active",
          position: weekNov4TapDetails.userPosition,
          totalContributors: weekNov4TapDetails.totalContributors,
          progressPercentage: Math.min(
            100,
            Math.round((weekNov4TapDetails.totalValue / 500) * 100)
          ),
          dashboard: DisplayedDashboard.WEEKLY_TAPS_NOV_4,
        },
        {
          image: "/images/runclub.png",
          title: "Lanna Run Club 🏃‍♂️",
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
          title: "Lanna Hacker Club 👩‍💻",
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
          image: "/images/yoga.png",
          title: "Lanna Workouts 🥊",
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
          image: "/images/hand.png",
          title: "Lanna Social Graph 🌐",
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
        {
          image: "/images/week.png",
          title: "Social Graph, Week of 10/27 💍",
          description: `${weekOct27TapDetails.totalValue} of 500 taps`,
          type: "active",
          position: weekOct27TapDetails.userPosition,
          totalContributors: weekOct27TapDetails.totalContributors,
          progressPercentage: Math.min(
            100,
            Math.round((weekOct27TapDetails.totalValue / 500) * 100)
          ),
          dashboard: DisplayedDashboard.WEEKLY_TAPS_OCT_27,
          past: true,
        },
        {
          image: "/images/week.png",
          title: "Social Graph, Week of 10/20",
          description: `${weeklyDetails.totalValue} of 500 taps`,
          type: "active",
          position: weeklyDetails.userPosition,
          totalContributors: weeklyDetails.totalContributors,
          progressPercentage: Math.min(
            100,
            Math.round((weeklyDetails.totalValue / 500) * 100)
          ),
          dashboard: DisplayedDashboard.WEEKLY,
          past: true,
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
        toast.info("Redirecting to Cherry...");
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
        title="Lanna Workouts 🥊"
        description={
          "Check into workouts at Red Dog Gallery, Apex Gym, Sting Hive, or Manasak Muay Thai Gym by tapping Curtis the Connections Elephant upon visiting. Help us reach the Lanna goal of 200 workouts during the month!"
        }
        leaderboardDetails={lannaTotalWorkoutDetails}
        leaderboardEntries={lannaTotalWorkoutEntries}
        goal={200}
        unit="workout"
        organizer="Cursive"
        organizerDescription="Cryptography for human connection"
        type="active"
        returnToHome={() => setDisplayedDashboard(DisplayedDashboard.NONE)}
        prize={true}
      />
    );
  }

  if (
    weeklyLeaderboardDetails &&
    weeklyLeaderboardEntries &&
    displayedDashboard === DisplayedDashboard.WEEKLY
  ) {
    return (
      <DashboardDetail
        image="/images/week-wide.png"
        title="Social Graph, Week of 10/20"
        description={
          <div className="flex flex-col gap-4">
            <span>
              Weekly tapping challenge to grow the Lanna Social Graph.{" "}
              <b>
                The top 10 contributors will win an exclusive Cursive NFC ring!
              </b>
            </span>
            <span>
              Make sure your tapping is natural, we want to incentive evangelism
              of the app experience and genuine connection. Not just tapping for
              the sake of tapping.
            </span>
          </div>
        }
        leaderboardDetails={weeklyLeaderboardDetails}
        leaderboardEntries={weeklyLeaderboardEntries}
        goal={500}
        unit="tap"
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
        unit="tap"
        organizer="Cursive"
        organizerDescription="Cryptography for human connection"
        type="active"
        returnToHome={() => setDisplayedDashboard(DisplayedDashboard.NONE)}
        prize={true}
        prizeRank={5}
      />
    );
  }

  if (
    weekNov4TapLeaderboardDetails &&
    weekNov4TapLeaderboardEntries &&
    displayedDashboard === DisplayedDashboard.WEEKLY_TAPS_NOV_4
  ) {
    return (
      <DashboardDetail
        image="/images/week-wide.png"
        title="Social Graph, Week of 11/4"
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
        leaderboardDetails={weekNov4TapLeaderboardDetails}
        leaderboardEntries={weekNov4TapLeaderboardEntries}
        goal={500}
        unit="tap"
        organizer="Cursive"
        organizerDescription="Cryptography for human connection"
        type="active"
        returnToHome={() => setDisplayedDashboard(DisplayedDashboard.NONE)}
        prize={true}
        prizeRank={5}
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
        title="Lanna Social Graph 🌐"
        description={`Grow the Lanna Social Graph by tapping NFC wristbands to share socials, organize your contacts, and discover common and complimentary interests!`}
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

  if (
    stravaLeaderboardDetails &&
    stravaLeaderboardEntries &&
    displayedDashboard === DisplayedDashboard.STRAVA
  ) {
    return (
      <DashboardDetail
        image="/images/runclub_wide.png"
        title="Lanna Run Club 🏃‍♂️"
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
        unit="km"
        organizer="Cursive"
        organizerDescription="Cryptography for human connection"
        actionItem={
          user &&
          (!user.oauth ||
            (user.oauth && !Object.keys(user?.oauth).includes("strava"))) && (
            <div
              className="w-full"
              onClick={() => logClientEvent("community-strava-clicked", {})}
            >
              <ImportStravaButton fullWidth />
            </div>
          )
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
        title="Lanna Hacker Club 👩‍💻"
        description={`Share your open source GitHub contributions with the Lanna Builder community!`}
        leaderboardDetails={githubLeaderboardDetails}
        leaderboardEntries={githubLeaderboardEntries}
        goal={1000}
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
      <div className="flex flex-col py-4">
        <span className="text-base font-bold text-label-primary font-sans">
          {`Applications`}
        </span>
        <div className="flex  overflow-x-scroll gap-2 pt-2">
          {[
            {
              href: "https://monaverse.com/collections/8453/0xafa80d3a82f6d749694de21b2dccf1e74a262547/1",
              emoji: <Mona />,
              label: "community-social-layer-link",
            },
            {
              href: "https://app.sola.day/event/edgecitylanna/",
              emoji: <Icons.SocialLayer size={18} />,
              text: "Social Layer",
              label: "community-social-layer-link",
            },
            {
              href: "https://cherry.builders/",
              emoji: "🍒",
              text: "Cherry",
              label: "community-cherry-link",
            },
            {
              href: "https://lannaedges.radicalxchange.org/",
              emoji: <span className="text-[16px]">∈</span>,
              text: "Edges",
              label: "community-edges-link",
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
                text={item?.text ? item.text : ""}
                external
              />
            </Link>
          ))}
        </div>
      </div>

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
