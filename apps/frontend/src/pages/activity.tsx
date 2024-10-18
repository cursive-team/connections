import React, { useState, useEffect } from "react";
import { storage } from "@/lib/storage";
import { Activity } from "@/lib/storage/types";
import { useRouter } from "next/router";
import { toast } from "sonner";
import AppLayout from "@/layouts/AppLayout";
import { FeedContent } from "@/components/ui/FeedContent";
import { CircleCard } from "@/components/ui/CircleCard";
import { MdKeyboardArrowRight as ArrowIcon } from "react-icons/md";
import Link from "next/link";
import {
  RegisterChipActivityDataSchema,
  TapActivityDataSchema,
} from "@/lib/activity";
import { ChipIssuer } from "@types";
import { Banner } from "@/components/cards/Banner";

interface ActivityDisplayItem {
  text: string;
  link?: string;
  timestamp: Date;
}

const parseActivity = (activity: Activity): ActivityDisplayItem => {
  switch (activity.type) {
    case "REGISTER":
      return {
        text: "You registered for Cursive Connections",
        timestamp: activity.timestamp,
      };
    case "REGISTER_CHIP":
      const { chipIssuer } = RegisterChipActivityDataSchema.parse(
        JSON.parse(activity.serializedData)
      );
      const chipIssuerMap: Record<ChipIssuer, string> = {
        EDGE_CITY_LANNA: "Edge City Lanna",
        DEVCON_2024: "Devcon 2024",
        TESTING: "Testing",
      };
      return {
        text: `You registered a chip for ${chipIssuerMap[chipIssuer]}`,
        timestamp: activity.timestamp,
      };
    case "TAP":
      const { chipOwnerUsername } = TapActivityDataSchema.parse(
        JSON.parse(activity.serializedData)
      );
      return {
        text: `You tapped ${chipOwnerUsername}`,
        link: `/people/${chipOwnerUsername}`,
        timestamp: activity.timestamp,
      };
    default:
      return {
        text: activity.serializedData,
        timestamp: activity.timestamp,
      };
  }
};

const ActivityPage: React.FC = () => {
  const router = useRouter();
  const [activityItems, setActivityItems] = useState<ActivityDisplayItem[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      const user = await storage.getUser();
      if (!user) {
        toast.error("User not found");
        router.push("/");
        return;
      }

      const parsedActivities = user.activities
        .map(parseActivity)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setActivityItems(parsedActivities);
    };

    fetchActivities();
  }, [router]);

  return (
    <AppLayout
      showHeader={false}
      headerDivider
      header={
        <div className="my-4 w-full">
          <Banner
            className="justify-center"
            title={
              <span className="!font-normal text-center">
                <b>Coming soon</b>: digital pheromones, superconnectors and{" "}
                <a
                  href="https://cursive.team/lanna"
                  className="underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  more
                </a>
                .
              </span>
            }
          />
        </div>
      }
      className="container mx-auto px-4 py-4"
    >
      <ul className="space-y-4">
        {activityItems.map((item, index) => {
          const Content = () => (
            <FeedContent
              title={<span>{item.text}</span>}
              icon={<CircleCard icon="person" />}
              description={item.timestamp.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            />
          );

          return (
            <div
              key={index}
              className="grid grid-cols-[1fr_20px] items-center gap-1"
            >
              {item.link ? (
                <Link href={item.link}>
                  <Content />
                </Link>
              ) : (
                <Content />
              )}
              {item?.link && <ArrowIcon className="ml-auto" />}
            </div>
          );
        })}
      </ul>
    </AppLayout>
  );
};

export default ActivityPage;
