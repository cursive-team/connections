import {
  CommunityCard,
  CommunityCardProps,
} from "@/components/cards/CommunityCard";
import { Icons } from "@/components/Icons";
import { CursiveLogo } from "@/components/ui/HeaderCover";
import { Tag } from "@/components/ui/Tag";
import AppLayout from "@/layouts/AppLayout";
import {
  getTopLeaderboardEntries,
  getUserLeaderboardDetails,
  lannaWeek1Leaderboard,
  retrieveWeeklyLeaderboard,
} from "@/lib/chip";
import { logClientEvent } from "@/lib/frontend/metrics";
import { storage } from "@/lib/storage";
import { ChipIssuer, LeaderboardDetails, LeaderboardEntries } from "@types";
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

const communityIssuer = ChipIssuer.TESTING;

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

  useEffect(() => {
    const fetchInfo = async () => {
      const { user, session } = await storage.getUserAndSession();
      if (!user || !session || session.authTokenExpiresAt < new Date()) {
        toast.error("Please log in to view the leaderboard.");
        router.push("/");
        return;
      }

      let details: LeaderboardDetails | null = null;
      try {
        details = await getUserLeaderboardDetails(communityIssuer);
      } catch (error) {
        console.error("Error getting user leaderboard details:", error);
        toast.error("Error getting user leaderboard details.");
        router.push("/profile");
        return;
      }
      if (!details) {
        toast.error("User leaderboard details not found.");
        router.push("/profile");
        return;
      }

      let entries: LeaderboardEntries | null = null;
      try {
        entries = await getTopLeaderboardEntries(communityIssuer);
      } catch (error) {
        console.error("Error getting top leaderboard entries:", error);
        toast.error("Error getting top leaderboard entries.");
        router.push("/profile");
        return;
      }
      if (!entries) {
        toast.error("Top leaderboard entries not found.");
        router.push("/profile");
        return;
      }

      setLeaderboardDetails(details);
      setLeaderboardEntries(entries);

      // get weekly leaderboard
      const { details: weeklyDetails, entries: weeklyEntries } =
        retrieveWeeklyLeaderboard(lannaWeek1Leaderboard, details, entries);

      setWeeklyLeaderboardDetails(weeklyDetails);
      setWeeklyLeaderboardEntries(weeklyEntries);

      const props: CommunityCardProps[] = [
        {
          image: "/images/hand.png",
          title: "Lanna Social Graph",
          description: `${details.totalTaps} of 2,000 taps`,
          type: "active",
          position: details.userPosition,
          totalContributors: details.totalContributors,
          progressPercentage: Math.min(
            100,
            Math.round((weeklyDetails.totalTaps / 2000) * 100)
          ),
        },
        {
          image: "/images/week.png",
          title: "Social Graph, Week of 10/20",
          description: `${weeklyDetails.totalTaps} of 500 taps`,
          type: "active",
          position: weeklyDetails.userPosition,
          totalContributors: weeklyDetails.totalContributors,
          progressPercentage: Math.min(
            100,
            Math.round((weeklyDetails.totalTaps / 500) * 100)
          ),
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
              label: "social-layer-link",
            },
            {
              href: "https://lannaedges.radicalxchange.org/",
              emoji: <span className="text-[16px]">∈</span>,
              text: "Edges",
              label: "edges-link",
            },
            {
              href: "https://cherry.builders/",
              emoji: "🍒",
              text: "Cherry",
              label: "cherry-link",
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
              {cardProps?.map((mock: CommunityCardProps, index) => {
                return (
                  <Link key={index} href={`/community/${index}`}>
                    <CommunityCard
                      image={mock?.image}
                      type="active"
                      title={mock?.title}
                      description={mock?.description}
                      progressPercentage={mock?.progressPercentage}
                      position={2}
                      totalContributors={mock?.totalContributors}
                    />
                  </Link>
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
