import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { CursiveLogo } from "@/components/ui/HeaderCover";
import {
  LeaderboardPosition,
  LeaderboardEntries,
  ChipIssuer,
  ChipIssuerSchema,
} from "@types";
import {getTopLeaderboardEntries, getUserLeaderboardPosition} from "@/lib/chip";

const communitiesEnum : { [key: string]: string } = {
  "edge_lanna": ChipIssuer.EDGE_CITY_LANNA,
  "devcon": ChipIssuer.DEVCON_2024,
  "testing": ChipIssuer.TESTING,
};

const communitiesHumanReadable : { [key: string]: string } = {
  "edge_lanna": "Edge City Lanna",
  "devcon": "Dev Con 2014",
  "testing": "Testing",
};

const LeaderboardPage: React.FC = () => {
  const router = useRouter();
  const { chipIssuer } = router.query;
  const [userLeaderboardPosition, setLeaderboardPosition] = useState<LeaderboardPosition | null>(null);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntries | null>(null);
  const [communityName, setCommunityName] = useState<string | null>(null);

  useEffect(() => {
    const fetchInfo = async() => {
      if (typeof chipIssuer == "string" ) {
        const chipIssuerMapping = communitiesEnum[chipIssuer];
        const chipIssuerEnum = ChipIssuerSchema.parse(chipIssuerMapping);

        const position = await getUserLeaderboardPosition(chipIssuerEnum);
        if (!position) {
          toast.error("User leaderboard position not found");
          router.push("/");
          return;
        }

        const entries = await getTopLeaderboardEntries(chipIssuerEnum)
        if (!entries) {
          toast.error("Top leaderboard entries not found");
          router.push("/");
          return;
        }

        setCommunityName(communitiesHumanReadable[chipIssuer]);
        setLeaderboardPosition(position);
        setLeaderboardEntries(entries);
      }
    }

    fetchInfo();
  }, [chipIssuer, router]);

  if (!userLeaderboardPosition || !leaderboardEntries || !communityName) {
    return (
      <div className="flex min-h-screen justify-center items-center text-center">
        <CursiveLogo isLoading />
      </div>
    );
  }

  return;
};

export default LeaderboardPage;
