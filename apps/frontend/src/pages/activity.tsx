import React, { useState, useEffect } from "react";
import { storage } from "@/lib/storage";
import { Activity } from "@/lib/storage/types";
import { useRouter } from "next/router";
import { toast } from "sonner";

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Activity
      </h1>
      <ul className="space-y-4">
        {activities.map((activity, index) => (
          <li
            key={index}
            className="bg-white dark:bg-gray-800 shadow rounded-lg p-4"
          >
            <div className="flex flex-col">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                Type: {activity.type}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Data: {activity.serializedData}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Timestamp: {activity.timestamp.toLocaleString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityPage;
