import React, { useState } from "react";
import { LannaDesiredConnections } from "@/lib/storage/types";
import { AppButton } from "@/components/ui/Button";
import { RegisterHeader } from "./RegisterHeader";
import { Tag } from "@/components/ui/Tag";
import { AppCopy } from "@/components/ui/AppCopy";

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

  const connectionsEmojiMapping: Record<string, string> = {
    getHealthy: "🏃",
    enjoyMeals: "🍲",
    haveCoffee: "☕️",
    party: "🎉",
    attendTalks: "🤓",
  };

  const handleToggle = (key: keyof LannaDesiredConnections) => {
    setConnections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(connections);
  };

  return (
    <div className="flex flex-col grow">
      <RegisterHeader title="How do you want to connect with others?" />
      <div className="flex flex-col mt-auto">
        <form onSubmit={handleSubmit} className="flex gap-4 flex-wrap">
          {Object.entries(connections).map(([key, value]) => {
            return (
              <div key={key} className="flex items-center">
                <input
                  type="checkbox"
                  id={key}
                  checked={value}
                  onChange={() =>
                    handleToggle(key as keyof LannaDesiredConnections)
                  }
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded hidden"
                />
                <Tag
                  variant={value ? "active" : "default"}
                  emoji={connectionsEmojiMapping?.[key]}
                  onClick={() =>
                    handleToggle(key as keyof LannaDesiredConnections)
                  }
                  text={
                    key.charAt(0).toUpperCase() +
                    key.slice(1).replace(/([A-Z])/g, " $1")
                  }
                />
              </div>
            );
          })}
          <AppButton className="mt-4" type="submit">
            Start discovering connections
          </AppButton>
        </form>
        <AppCopy className="text-center py-4" />
      </div>
    </div>
  );
};

export default LannaDiscoverConnections;
