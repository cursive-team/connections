import React, { useState } from "react";
import { LannaDesiredConnections } from "@/lib/storage/types";

interface LannaDiscoverConnectionsProps {
  onSubmit: (desiredConnections: LannaDesiredConnections) => void;
}

const LannaDiscoverConnections: React.FC<LannaDiscoverConnectionsProps> = ({
  onSubmit,
}) => {
  const [connections, setConnections] = useState<LannaDesiredConnections>({
    getHealthy: false,
    enjoyMeals: false,
    haveCoffee: false,
    party: false,
    attendTalks: false,
  });

  const handleToggle = (key: keyof LannaDesiredConnections) => {
    setConnections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(connections);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-black">
        Select Your Desired Connections
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.entries(connections).map(([key, value]) => (
          <div key={key} className="flex items-center">
            <input
              type="checkbox"
              id={key}
              checked={value}
              onChange={() =>
                handleToggle(key as keyof LannaDesiredConnections)
              }
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor={key} className="ml-2 block text-sm text-black">
              {key.charAt(0).toUpperCase() +
                key.slice(1).replace(/([A-Z])/g, " $1")}
            </label>
          </div>
        ))}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default LannaDiscoverConnections;
