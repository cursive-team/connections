import {
  CommunityCard,
  CommunityCardProps,
  DisplayedDashboard,
} from "@/components/cards/CommunityCard";
import { DashboardDetail } from "@/components/dashboard/DashboardDetail";
import { Icons } from "@/components/Icons";
import { CursiveLogo } from "@/components/ui/HeaderCover";
import { Tag } from "@/components/ui/Tag";
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
      image: "/images/runclub.png",
      title: "Lanna Run Club (Strava)",
      description: "100km",
      type: "community",
      totalContributors: 75,
      progressPercentage: 24,
    },
    {
      image: "/images/build.png",
      title: "Lanna Build Club (GitHub)",
      description: "500 commits",
      type: "community",
      totalContributors: 50,
      progressPercentage: 89,
    },
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
  const [weeklyLeaderboardDetails, setWeeklyLeaderboardDetails] =
    useState<LeaderboardDetails | null>(null);
  const [weeklyLeaderboardEntries, setWeeklyLeaderboardEntries] =
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
      let weeklyDetails: LeaderboardDetails | null = null;
      let weeklyEntries: LeaderboardEntries | null = null;
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
      } catch (error) {
        console.error("Error getting user leaderboard info:", error);
        toast.error("Error getting user leaderboard info.");
        router.push("/profile");
        return;
      }
      if (!details || !entries || !weeklyDetails || !weeklyEntries) {
        toast.error("User leaderboard info not found.");
        router.push("/profile");
        return;
      }

      setLeaderboardDetails(details);
      setLeaderboardEntries(entries);
      setWeeklyLeaderboardDetails(weeklyDetails);
      setWeeklyLeaderboardEntries(weeklyEntries);

      const props: CommunityCardProps[] = [
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
        },
      ];
      setCardProps(props);
    };

    fetchInfo();
  }, [router]);

  // track if people are using the external links
  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: { href: string; label: string }
  ) => {
    e.preventDefault();
    logClientEvent(item.label, {});
    window.open(item.href, "_blank", "noopener,noreferrer");
  };

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
                    onClick={() =>
                      setDisplayedDashboard(
                        prop?.dashboard || DisplayedDashboard.NONE
                      )
                    }
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
