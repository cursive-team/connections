import React, { useState, useEffect } from "react";
import Link from "next/link";
import { storage } from "@/lib/storage";
import { Connection } from "@/lib/storage/types";
import AppLayout from "@/layouts/AppLayout";
import { MdKeyboardArrowRight as ArrowRight } from "react-icons/md";

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
    <AppLayout className="mx-auto" withContainer={false}>
      {Object.keys(connections).length === 0 ? (
        <div className="p-4 text-center text-secondary">
          {`No connections yet. Tap another person's chip to get started!`}
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
                  <div className="size-10 rounded-full bg-button-secondary"></div>
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
