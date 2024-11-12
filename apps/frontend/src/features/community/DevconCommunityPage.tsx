import {
  CommunityCard,
  CommunityCardProps,
  DisplayedDashboard,
} from "@/components/cards/CommunityCard";
import { DashboardDetail } from "@/components/dashboard/DashboardDetail";
import { CursiveLogo } from "@/components/ui/HeaderCover";
import {
  getTopLeaderboardEntries,
  getUserLeaderboardDetails,
} from "@/lib/chip";
import { logClientEvent } from "@/lib/frontend/metrics";
import { storage } from "@/lib/storage";
import {
  ChipIssuer,
  LeaderboardDetails,
  LeaderboardEntries,
  LeaderboardEntryType,
} from "@types";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DevconCommunityPage({
  displayedDashboard,
  setDisplayedDashboard,
}: {
  displayedDashboard: DisplayedDashboard;
  setDisplayedDashboard: (dashboard: DisplayedDashboard) => void;
}) {
  const router = useRouter();
  const [leaderboardDetails, setLeaderboardDetails] =
    useState<LeaderboardDetails | null>(null);
  const [leaderboardEntries, setLeaderboardEntries] =
    useState<LeaderboardEntries | null>(null);
  const [day1Details, setDay1Details] = useState<LeaderboardDetails | null>(
    null
  );
  const [day1Entries, setDay1Entries] = useState<LeaderboardEntries | null>(
    null
  );
  const [day2Details, setDay2Details] = useState<LeaderboardDetails | null>(
    null
  );
  const [day2Entries, setDay2Entries] = useState<LeaderboardEntries | null>(
    null
  );

  const [cardProps, setCardProps] = useState<CommunityCardProps[]>([]);

  useEffect(() => {
    const fetchInfo = async () => {
      const { user, session } = await storage.getUserAndSession();
      if (!user || !session || session.authTokenExpiresAt < new Date()) {
        toast.error("Please log in to view the leaderboard.");
        router.push("/");
        return;
      }

      const communityIssuer: ChipIssuer = ChipIssuer.DEVCON_2024;

      let totalTapDetails: LeaderboardDetails | null = null;
      let totalTapEntries: LeaderboardEntries | null = null;
      let day1TapDetails: LeaderboardDetails | null = null;
      let day1TapEntries: LeaderboardEntries | null = null;
      let day2TapDetails: LeaderboardDetails | null = null;
      let day2TapEntries: LeaderboardEntries | null = null;

      try {
        [
          totalTapDetails,
          totalTapEntries,
          day1TapDetails,
          day1TapEntries,
          day2TapDetails,
          day2TapEntries,
        ] = await Promise.all([
          getUserLeaderboardDetails(
            communityIssuer,
            LeaderboardEntryType.DEVCON_2024_TAP_COUNT
          ),
          getTopLeaderboardEntries(
            communityIssuer,
            LeaderboardEntryType.DEVCON_2024_TAP_COUNT
          ),
          getUserLeaderboardDetails(
            communityIssuer,
            LeaderboardEntryType.DEVCON_2024_DAY_1_TAP_COUNT
          ),
          getTopLeaderboardEntries(
            communityIssuer,
            LeaderboardEntryType.DEVCON_2024_DAY_1_TAP_COUNT
          ),
          getUserLeaderboardDetails(
            communityIssuer,
            LeaderboardEntryType.DEVCON_2024_DAY_2_TAP_COUNT
          ),
          getTopLeaderboardEntries(
            communityIssuer,
            LeaderboardEntryType.DEVCON_2024_DAY_2_TAP_COUNT
          ),
        ]);
      } catch (error) {
        console.error("Error getting user leaderboard info:", error);
        toast.error("Error getting user leaderboard info.");
        router.push("/profile");
        return;
      }

      if (
        !totalTapDetails ||
        !totalTapEntries ||
        !day1TapDetails ||
        !day1TapEntries ||
        !day2TapDetails ||
        !day2TapEntries
      ) {
        toast.error("User leaderboard info not found.");
        router.push("/profile");
        return;
      }

      setLeaderboardDetails(totalTapDetails);
      setLeaderboardEntries(totalTapEntries);
      setDay1Details(day1TapDetails);
      setDay1Entries(day1TapEntries);
      setDay2Details(day2TapDetails);
      setDay2Entries(day2TapEntries);

      const now = new Date();
      const thailandOffset = 7; // UTC+7
      const thailandTime = new Date(
        now.getTime() + thailandOffset * 60 * 60 * 1000
      );
      const isDay2Started =
        thailandTime >= new Date("2024-11-13T00:00:00+07:00");

      const props: CommunityCardProps[] = [
        {
          image: "/images/hand.png",
          title: "coSNARK Tap Leaderboard 🏆",
          description: `${totalTapDetails.totalValue} of 2000 taps`,
          type: "active",
          position: totalTapDetails.userPosition,
          totalContributors: totalTapDetails.totalContributors,
          progressPercentage: Math.min(
            100,
            Math.round((totalTapDetails.totalValue / 2000) * 100)
          ),
          dashboard: DisplayedDashboard.DEVCON_2024_TAP_COUNT,
        },
      ];

      const day1Card: CommunityCardProps = {
        image: "/images/week.png",
        title: "Day 1 coSNARK Tap Leaderboard 💫",
        description: `${day1TapDetails.totalValue} of 500 taps`,
        type: "active",
        position: day1TapDetails.userPosition,
        totalContributors: day1TapDetails.totalContributors,
        progressPercentage: Math.min(
          100,
          Math.round((day1TapDetails.totalValue / 500) * 100)
        ),
        dashboard: DisplayedDashboard.DEVCON_2024_DAY_1_TAP_COUNT,
        past: isDay2Started,
      };

      if (isDay2Started) {
        props.push({
          image: "/images/week.png",
          title: "Devcon Day 2 Social Graph 💫",
          description: `${day2TapDetails.totalValue} of 500 taps`,
          type: "active",
          position: day2TapDetails.userPosition,
          totalContributors: day2TapDetails.totalContributors,
          progressPercentage: Math.min(
            100,
            Math.round((day2TapDetails.totalValue / 500) * 100)
          ),
          dashboard: DisplayedDashboard.DEVCON_2024_DAY_2_TAP_COUNT,
        });
      }

      props.push(day1Card);
      setCardProps(props);
    };

    fetchInfo();
  }, [router]);

  if (
    day1Details &&
    day1Entries &&
    displayedDashboard === DisplayedDashboard.DEVCON_2024_DAY_1_TAP_COUNT
  ) {
    return (
      <DashboardDetail
        image="/images/week-wide.png"
        title="Day 1 coSNARK Tap Leaderboard 💫"
        description={
          <>
            <span>
              Tap NFC chips on Day 1 to share socials and discover common &
              complimentary interests! The top 5 by 6pm will receive an
              exclusive Cursive NFC ring 💍.
            </span>
            <br />
            <br />
            <span>
              Each tap is privately verified with Collaborative SNARKs built by{" "}
              <a
                href="https://taceo.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-link-primary"
              >
                TACEO
              </a>
              . Secret shares of your data is split between Cursive,{" "}
              <a
                href="https://taceo.io/"
                target="_blank"
                rel="noopener noreferrer"
              >
                TACEO
              </a>
              , and{" "}
              <a
                href="https://pse.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-link-primary"
              >
                PSE
              </a>{" "}
              servers, who work together to generate a proof you have a valid
              tap. This means you can delegate ZK proving without sacrificing
              privacy!
            </span>
          </>
        }
        leaderboardDetails={day1Details}
        leaderboardEntries={day1Entries}
        goal={500}
        unit="tap"
        organizer="Cursive"
        organizerDescription="Cryptography for human connection"
        type="active"
        returnToHome={() => setDisplayedDashboard(DisplayedDashboard.NONE)}
      />
    );
  }

  if (
    day2Details &&
    day2Entries &&
    displayedDashboard === DisplayedDashboard.DEVCON_2024_DAY_2_TAP_COUNT
  ) {
    return (
      <DashboardDetail
        image="/images/social-graph-wide.png"
        title="Day 2 coSNARK Tap Leaderboard 💫"
        description={
          <>
            <span>
              Tap NFC chips on Day 1 to share socials and discover common &
              complimentary interests! The top 5 by 6pm will receive an
              exclusive Cursive NFC ring 💍.
            </span>
            <br />
            <br />
            <span>
              Each tap is privately verified with Collaborative SNARKs built by{" "}
              <a
                href="https://taceo.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-link-primary"
              >
                TACEO
              </a>
              . Secret shares of your data is split between Cursive,{" "}
              <a
                href="https://taceo.io/"
                target="_blank"
                rel="noopener noreferrer"
              >
                TACEO
              </a>
              , and{" "}
              <a
                href="https://pse.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-link-primary"
              >
                PSE
              </a>{" "}
              servers, who work together to generate a proof you have a valid
              tap. This means you can delegate ZK proving without sacrificing
              privacy!
            </span>
          </>
        }
        leaderboardDetails={day2Details}
        leaderboardEntries={day2Entries}
        goal={500}
        unit="tap"
        organizer="Cursive"
        organizerDescription="Cryptography for human connection"
        type="active"
        returnToHome={() => setDisplayedDashboard(DisplayedDashboard.NONE)}
      />
    );
  }

  if (
    leaderboardDetails &&
    leaderboardEntries &&
    displayedDashboard === DisplayedDashboard.DEVCON_2024_TAP_COUNT
  ) {
    return (
      <DashboardDetail
        image="/images/social-graph-wide.png"
        title="coSNARK Tap Leaderboard 🏆"
        description={
          <>
            <span>
              Grow the Devcon Social Graph by tapping NFC chips to share socials
              and discover common and complimentary interests!
            </span>
            <br />
            <br />
            <span>
              Each tap is privately verified with Collaborative SNARKs built by{" "}
              <a
                href="https://taceo.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-link-primary"
              >
                TACEO
              </a>
              . Secret shares of your data is split between Cursive,{" "}
              <a
                href="https://taceo.io/"
                target="_blank"
                rel="noopener noreferrer"
              >
                TACEO
              </a>
              , and{" "}
              <a
                href="https://pse.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-link-primary"
              >
                PSE
              </a>{" "}
              servers, who work together to generate a proof you have a valid
              tap. This means you can delegate ZK proving without sacrificing
              privacy!
            </span>
          </>
        }
        leaderboardDetails={leaderboardDetails}
        leaderboardEntries={leaderboardEntries}
        goal={2000}
        unit="tap"
        organizer="Cursive"
        organizerDescription="Cryptography for human connection"
        type="active"
        returnToHome={() => setDisplayedDashboard(DisplayedDashboard.NONE)}
      />
    );
  }

  return (
    <>
      {!leaderboardDetails || !leaderboardEntries ? (
        <div className="flex justify-center items-center pt-4">
          <CursiveLogo isLoading />
        </div>
      ) : (
        <div className="flex flex-col gap-6 pt-2 pb-6">
          <div className="flex flex-col gap-2">
            <span className="text-base font-bold text-label-primary font-sans">
              {`Dashboards`}
            </span>
            {cardProps?.map((prop: CommunityCardProps, index) => {
              return prop.past ? (
                <></>
              ) : (
                <div
                  key={index}
                  onClick={() => {
                    logClientEvent("community-dashboard-clicked", {
                      title: prop?.title,
                    });
                    setDisplayedDashboard(
                      prop?.dashboard || DisplayedDashboard.NONE
                    );
                  }}
                >
                  <CommunityCard
                    image={prop?.image}
                    type="active"
                    title={prop?.title}
                    description={prop?.description}
                    progressPercentage={prop?.progressPercentage}
                    position={prop?.position}
                    totalContributors={prop?.totalContributors}
                    dashboard={prop?.dashboard}
                  />
                </div>
              );
            })}
          </div>
          {/* <div className="flex flex-col gap-2">
            <span className="text-base font-bold text-label-primary font-sans">
              {`Past dashboards`}
            </span>
            {cardProps?.map((prop: CommunityCardProps, index) => {
              return !prop.past ? (
                <></>
              ) : (
                <div
                  key={index}
                  onClick={() => {
                    logClientEvent("community-dashboard-clicked", {
                      title: prop?.title,
                    });
                    setDisplayedDashboard(
                      prop?.dashboard || DisplayedDashboard.NONE
                    );
                  }}
                >
                  <CommunityCard
                    image={prop?.image}
                    type="active"
                    title={prop?.title}
                    description={prop?.description}
                    progressPercentage={prop?.progressPercentage}
                    position={prop?.position}
                    totalContributors={prop?.totalContributors}
                    dashboard={prop?.dashboard}
                  />
                </div>
              );
            })}
          </div> */}
        </div>
      )}
    </>
  );
}
