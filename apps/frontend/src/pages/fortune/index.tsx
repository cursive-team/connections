import { BASE_API_URL } from "@/config";
import { cn } from "@/lib/frontend/util";
import { Ephesis, Poppins } from "next/font/google";
import React, { useEffect, useState } from "react";

const ephesis = Ephesis({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-ephesis",
});

const poppins = Poppins({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export default function FortunePage() {
  const [pairConnection, setPairConnection] = useState<{
    state: string;
    score?: number;
    createdAt?: Date;
  } | null>(null);
  const [firstFetchCompleteTime, setFirstFetchCompleteTime] =
    useState<Date | null>(null);

  useEffect(() => {
    const fetchPairConnection = async () => {
      console.log("Fetching pair connection");
      try {
        const response = await fetch(
          `${BASE_API_URL}/data_hash/pair_connection`
        );
        const data = await response.json();
        const connection = {
          ...data,
          createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
        };

        console.log("Connection:", connection, firstFetchCompleteTime);

        // If we have a score and no firstFetchCompleteTime, set it
        if (connection.score !== undefined && !firstFetchCompleteTime) {
          setFirstFetchCompleteTime(new Date());
        }

        // Reset firstFetchCompleteTime if score disappears
        if (connection.score === undefined && firstFetchCompleteTime) {
          setFirstFetchCompleteTime(null);
          setPairConnection(null);
          return;
        }

        // Clear connection if it's too old
        if (
          firstFetchCompleteTime &&
          new Date().getTime() - firstFetchCompleteTime.getTime() > 15000
        ) {
          setPairConnection(null);
          return;
        }

        // Only update connection state if it's different
        if (JSON.stringify(connection) !== JSON.stringify(pairConnection)) {
          setPairConnection(connection);
        }
      } catch (error) {
        console.error("Error fetching pair connection:", error);
      }
    };

    const interval = setInterval(fetchPairConnection, 2000);
    return () => clearInterval(interval);
  }, [firstFetchCompleteTime, pairConnection]);

  const getTopMessage = () => {
    if (
      pairConnection &&
      pairConnection.state === "complete" &&
      pairConnection.score
    ) {
      const connectionScore = pairConnection.score;

      if (connectionScore >= 0.9) {
        return "Twin";
      } else if (connectionScore >= 0.7) {
        return "Kindred";
      } else if (connectionScore >= 0.5) {
        return "Harmonized";
      } else if (connectionScore >= 0.3) {
        return "Aligned";
      } else {
        return "Unique";
      }
    }

    if (pairConnection?.state === "waiting") {
      return "Waiting";
    }

    return "Welcome";
  };

  const getBottomMessage = () => {
    if (!pairConnection) {
      return "Tap Curtis to discover your pair fortune...";
    }

    if (pairConnection.state === "waiting") {
      return "Waiting for your pair...";
    }

    if (pairConnection.score !== undefined) {
      return `similarity score: ${Math.round(pairConnection.score * 100)}`;
    }

    return "Tap Curtis to discover your pair fortune...";
  };

  return (
    <div
      style={{
        backgroundImage: `url('/images/desktop-halloween.png')`,
      }}
      className={cn(
        "flex flex-col h-screen items-center justify-center bg-cover gap-10 lg:gap-2"
      )}
    >
      <span
        className={cn(
          "text-[80px] lg:text-[200px] text-[#FF8F3F] font-normal tracking-[-5.1px] rotate-[-10deg] text-center -mt-10",
          ephesis.variable,
          ephesis.className
        )}
      >
        {getTopMessage()}
      </span>
      <span
        className={cn(
          poppins?.variable,
          poppins?.className,
          "text-bold text-white text-[48px] lg:text-[96px] leading-none text-center -mt-10 mt-10"
        )}
      >
        {getBottomMessage()}
      </span>
    </div>
  );
}
