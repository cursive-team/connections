import React, { useState, useEffect } from "react";
import Link from "next/link";
import { storage } from "@/lib/storage";
import { Connection } from "@/lib/storage/types";

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Connections</h1>
      <ul className="space-y-4">
        {Object.values(connections).map((connection) => (
          <li
            key={connection.user.username}
            className="bg-white dark:bg-gray-800 shadow rounded-lg p-4"
          >
            <Link href={`/people/${connection.user.username}`}>
              <a className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {connection.user.displayName}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    @{connection.user.username}
                  </p>
                </div>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PeoplePage;
