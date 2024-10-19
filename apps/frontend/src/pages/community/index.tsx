import {
  CommunityCard,
  CommunityCardProps,
} from "@/components/cards/CommunityCard";
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
      title: "Example",
      description: "2,000 of 3,000 taps",
      type: "active",
      position: 1,
      totalContributors: 10,
      progressPercentage: 88,
    },
    {
      title: "Example",
      description: "2,000 of 3,000 taps",
      type: "active",
      position: 2,
      totalContributors: 10,
      progressPercentage: 10,
    },
    {
      title: "Example",
      description: "2,000 of 3,000 taps",
      type: "active",
      position: 3,
      totalContributors: 10,
      progressPercentage: 24,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {mocks?.map((mock: CommunityCardProps, index) => {
        return (
          <Link key={index} href={`/community/${index}`}>
            <CommunityCard
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

const ExtraCommunityGoals = () => {
  const mocks: CommunityCardProps[] = [
    {
      title: "Example",
      description: "120km",
      type: "community",
      totalContributors: 10,
      progressPercentage: 24,
    },
    {
      title: "Example",
      description: "120km",
      type: "community",
      totalContributors: 10,
      progressPercentage: 89,
    },
    {
      title: "Example",
      description: "120km",
      type: "community",
      totalContributors: 10,
      progressPercentage: 100,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {mocks?.map((mock: CommunityCardProps, index) => {
        return (
          <Link key={index} href={`/community/${index}`}>
            <CommunityCard
              type="community"
              title={mock?.title}
              description={mock?.description}
              progressPercentage={mock?.progressPercentage}
              totalContributors={mock?.totalContributors}
            />
          </Link>
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
          <Link className="min-w-max" href="/">
            <Tag emoji="👨🏾‍💻" variant="gray" text="Lorem ipsum" external />
          </Link>
          <Link className="min-w-max" href="/">
            <Tag emoji="👨🏾‍💻" variant="gray" text="Lorem ipsum" external />
          </Link>
          <Link className="min-w-max" href="/">
            <Tag emoji="👨🏾‍💻" variant="gray" text="Lorem ipsum" external />
          </Link>{" "}
          <Link className="min-w-max" href="/">
            <Tag emoji="👨🏾‍💻" variant="gray" text="Lorem ipsum" external />
          </Link>
        </div>
        <div className="flex flex-col gap-6 pt-2 pb-6">
          <div className="flex flex-col gap-2">
            <span className="text-base font-bold text-primary font-sans">
              {`You're contributing!`}
            </span>
            <Contributions />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-base font-bold text-primary font-sans">
              Contribute to more community goals
            </span>
            <ExtraCommunityGoals />
          </div>
        </div>
      </AppLayout>
    </>
  );
}
