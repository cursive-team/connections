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
  LocationTapActivityDataSchema,
  PSIActivityDataSchema,
  RegisterChipActivityDataSchema,
  TapActivityDataSchema,
  TapBackReceivedActivityDataSchema,
  TapBackSentActivityDataSchema,
} from "@/lib/activity";
import { ChipIssuer } from "@types";
import { cn } from "@/lib/frontend/util";

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
        USER: "user",
        EDGE_CITY_LANNA: "Edge City Lanna",
        DEVCON_2024: "Devcon 2024",
        ETH_INDIA_2024: "Eth India 2024",
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
    case "PSI":
      const { connectionUsername } = PSIActivityDataSchema.parse(
        JSON.parse(activity.serializedData)
      );
      return {
        text: `You ran PSI with ${connectionUsername}`,
        link: `/people/${connectionUsername}`,
        timestamp: activity.timestamp,
      };
    case "TAP_BACK_SENT":
      const { connectionUsername: tapBackSentConnectionUsername } =
        TapBackSentActivityDataSchema.parse(
          JSON.parse(activity.serializedData)
        );
      return {
        text: `You tapped ${tapBackSentConnectionUsername} back`,
        link: `/people/${tapBackSentConnectionUsername}`,
        timestamp: activity.timestamp,
      };
    case "TAP_BACK_RECEIVED":
      const { connectionUsername: tapBackReceivedConnectionUsername } =
        TapBackReceivedActivityDataSchema.parse(
          JSON.parse(activity.serializedData)
        );
      return {
        text: `${tapBackReceivedConnectionUsername} tapped you back`,
        link: `/people/${tapBackReceivedConnectionUsername}`,
        timestamp: activity.timestamp,
      };
    case "LOCATION_TAP":
      const { locationId, locationName } = LocationTapActivityDataSchema.parse(
        JSON.parse(activity.serializedData)
      );
      return {
        text: `You checked into ${locationName}`,
        link: `/locations/${locationId}`,
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
      showFooter={false}
      back={{
        href: "/profile",
        label: "Back",
        content: (
          <div
            className="absolute left-0 right-0 bottom-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, #7A74BC 0%, #FF9DF8 39%, #FB5D42 71%, #F00 100%)`,
            }}
          ></div>
        ),
      }}
      className="container mx-auto px-4 py-4"
    >
      <div className="flex items-center gap-0.5 pb-2">
        <span className="text-lg font-semibold leading-none text-label-primary">
          Your activity
        </span>
      </div>
      {Object.entries(
        activityItems.reduce((acc, item) => {
          const date = item.timestamp.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          });
          if (!acc[date]) acc[date] = [];
          acc[date].push(item);
          return acc;
        }, {} as Record<string, typeof activityItems>)
      ).map(([date, items]) => (
        <div className="mb-6" key={date}>
          <div className="mb-2">
            <span className="text-[12px] text-label-quaternary font-semibold">
              {date}
            </span>
          </div>
          <ul>
            {items.map((item, index) => {
              const Content = () => (
                <FeedContent
                  title={<span>{item.text}</span>}
                  icon={<CircleCard icon="person" />}
                  description={item.timestamp.toLocaleString("en-US", {
                    hour: "2-digit",
                    minute: "numeric",
                  })}
                />
              );

              return (
                <div
                  key={index}
                  className={cn(
                    "grid items-center gap-1 mb-4",
                    item?.link && "grid-cols-[1fr_20px]"
                  )}
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
        </div>
      ))}
    </AppLayout>
  );
};

export default ActivityPage;
