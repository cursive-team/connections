import React, { useState, useEffect } from "react";
import Link from "next/link";
import { storage } from "@/lib/storage";
import { Connection } from "@/lib/storage/types";
import AppLayout from "@/layouts/AppLayout";
import { MdKeyboardArrowRight as ArrowRight } from "react-icons/md";
import { ProfileImage } from "@/components/ui/ProfileImage";

const PeoplePage: React.FC = () => {
  const [connections, setConnections] = useState<Record<string, Connection>>(
    {}
  );

  useEffect(() => {
    const fetchConnections = async () => {
      const user = await storage.getUser();
      if (!user) {
        return;
      }

      setConnections(user.connections);
    };

    fetchConnections();
  }, []);

  return (
    <AppLayout
      header={
        <>
          <span className="text-primary font-medium">People</span>
          <div
            className="absolute left-0 right-0 bottom-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, #7A74BC 0%, #FF9DF8 39%, #FB5D42 71%, #F00 100%)`,
            }}
          ></div>
        </>
      }
      className="mx-auto"
      withContainer={false}
    >
      {Object.keys(connections).length === 0 ? (
        <div className="p-4 text-center text-secondary px-16">
          {`No connections yet. Tap another person's wristband to get started!`}
        </div>
      ) : (
        <ul className="flex flex-col">
          {Object.values(connections).map((connection) => (
            <li
              key={connection.user.username}
              className="p-4"
              style={{
                // for some reason tailwind not applying
                borderBottom: "0.5px solid rgba(0, 0, 0, 0.20)",
              }}
            >
              <Link
                className="grid grid-cols-[1fr_20px] items-center gap-4"
                href={`/people/${connection.user.username}`}
              >
                <div className="flex items-center gap-4">
                  <ProfileImage user={connection.user} />
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-primary">
                      {connection.user.displayName}
                    </span>
                    <span className="text-xs text-secondary font-medium">
                      @{connection.user.username}
                    </span>
                  </div>
                </div>
                <ArrowRight className="ml-auto" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AppLayout>
  );
};

export default PeoplePage;
