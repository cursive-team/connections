import React, { useState, useEffect } from "react";
import { storage } from "@/lib/storage";
import { Activity } from "@/lib/storage/types";
import { useRouter } from "next/router";
import { toast } from "sonner";
import AppLayout from "@/layouts/AppLayout";
import { FeedContent } from "@/components/ui/FeedContent";
import { CircleCard } from "@/components/ui/CircleCard";
import { MdKeyboardArrowRight as ArrowIcon } from "react-icons/md";

const ActivityPage: React.FC = () => {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      const user = await storage.getUser();
      if (!user) {
        toast.error("User not found");
        router.push("/");
        return;
      }

      setActivities(user.activities);
    };

    fetchActivities();
  }, [router]);

  return (
    <AppLayout
      showHeader={false}
      header={
        <>
          <span className="text-primary font-medium">Activity</span>
          <div
            className="absolute left-0 right-0 bottom-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, #7A74BC 0%, #FF9DF8 39%, #FB5D42 71%, #F00 100%)`,
            }}
          ></div>
        </>
      }
      className="container mx-auto px-4 py-8"
    >
      <ul className="space-y-4">
        {activities.map((activity, index) => {
          return (
            <div
              key={index}
              className="grid grid-cols-[1fr_20px] items-center gap-1"
            >
              <FeedContent
                title={<span>{activity.serializedData}</span>}
                icon={<CircleCard icon="person" />}
                description={activity.timestamp.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              />
              <ArrowIcon className="ml-auto" />
            </div>
          );
        })}
      </ul>
    </AppLayout>
  );
};

export default ActivityPage;
