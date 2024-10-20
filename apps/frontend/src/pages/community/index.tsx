import {
  CommunityCard,
  CommunityCardProps,
} from "@/components/cards/CommunityCard";
import { Icons } from "@/components/Icons";
import { Tag } from "@/components/ui/Tag";
import AppLayout from "@/layouts/AppLayout";
import { Metadata } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Community",
};

const Contributions = () => {
  const mocks: CommunityCardProps[] = [
    {
      image: "/images/hand.png",
      title: "Lanna Social Graph",
      description: "2,000 of 3,000 taps",
      type: "active",
      position: 1,
      totalContributors: 10,
      progressPercentage: 88,
    },
    {
      image: "/images/week.png",
      title: "Social Graph, Week of 10/20",
      description: "2,000 of 3,000 taps",
      type: "active",
      position: 2,
      totalContributors: 10,
      progressPercentage: 10,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {mocks?.map((mock: CommunityCardProps, index) => {
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
  );
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
          <Link
            className="min-w-max"
            href="https://app.sola.day/event/edgecitylanna/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Tag
              emoji={<Icons.SocialLayer size={18} />}
              variant="gray"
              text="Social Layer"
              external
            />
          </Link>
          <Link
            className="min-w-max"
            href="/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Tag
              emoji={<span className="text-[16px]">∈</span>}
              variant="gray"
              text="Edges"
              external
            />
          </Link>
          <Link
            className="min-w-max"
            href="https://cherry.builders/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Tag emoji="🍒" variant="gray" text="Cherry" external />
          </Link>{" "}
        </div>
        <div className="flex flex-col gap-6 pt-2 pb-6">
          <div className="flex flex-col gap-2">
            <span className="text-base font-bold text-primary font-sans">
              {`Contribute now!`}
            </span>
            <Contributions />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-base font-bold text-primary font-sans">
              Coming soon!
            </span>
            <ComingSoonCommunityGoals />
          </div>
        </div>
      </AppLayout>
    </>
  );
}
