import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { CursiveLogo } from "@/components/ui/HeaderCover";
import {
  LeaderboardEntries,
  ChipIssuer,
  ChipIssuerSchema,
  LeaderboardDetails,
} from "@types";
import {
  getTopLeaderboardEntries,
  getUserLeaderboardDetails,
} from "@/lib/chip";

const communitiesEnum: { [key: string]: string } = {
  lanna: ChipIssuer.EDGE_CITY_LANNA,
  devcon: ChipIssuer.DEVCON_2024,
  testing: ChipIssuer.TESTING,
};

const communitiesHumanReadable: { [key: string]: string } = {
  lanna: "Edge City Lanna",
  devcon: "Devcon SEA",
  testing: "Testing",
};

const LeaderboardPage: React.FC = () => {
  const router = useRouter();
  const { chipIssuer } = router.query;
  const [leaderboardDetails, setLeaderboardDetails] =
    useState<LeaderboardDetails | null>(null);
  const [leaderboardEntries, setLeaderboardEntries] =
    useState<LeaderboardEntries | null>(null);
  const [communityName, setCommunityName] = useState<string | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      if (typeof chipIssuer == "string") {
        const chipIssuerMapping = communitiesEnum[chipIssuer];
        const chipIssuerEnum = ChipIssuerSchema.parse(chipIssuerMapping);

        let details: LeaderboardDetails | null = null;
        try {
          details = await getUserLeaderboardDetails(chipIssuerEnum);
        } catch (error) {
          console.error("Error getting user leaderboard details:", error);
          toast.error("Error getting user leaderboard details.");
          router.push("/");
          return;
        }
        if (!details) {
          toast.error("User leaderboard details not found.");
          router.push("/");
          return;
        }

        let entries: LeaderboardEntries | null = null;
        try {
          entries = await getTopLeaderboardEntries(chipIssuerEnum);
        } catch (error) {
          console.error("Error getting top leaderboard entries:", error);
          toast.error("Error getting top leaderboard entries.");
          router.push("/");
          return;
        }
        if (!entries) {
          toast.error("Top leaderboard entries not found.");
          router.push("/");
          return;
        }

        setCommunityName(communitiesHumanReadable[chipIssuer]);
        setLeaderboardDetails(details);
        setLeaderboardEntries(entries);
      }
    };

    fetchInfo();
  }, [chipIssuer, router]);

  if (!leaderboardDetails || !leaderboardEntries || !communityName) {
    return (
      <div className="flex min-h-screen justify-center items-center text-center">
        <CursiveLogo isLoading />
      </div>
    );
  }

  return;
};

export default LeaderboardPage;
