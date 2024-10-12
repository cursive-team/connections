import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { storage } from "@/lib/storage";
import { User } from "@/lib/storage/types";
import { toast } from "sonner";
import AppLayout from "@/layouts/AppLayout";
import { ProfileImage } from "@/components/ui/ProfileImage";
import { CursiveLogo } from "@/components/ui/HeaderCover";

const LeaderboardPage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await storage.getUser();
      if (user) {
        setUser(user);
      } else {
        toast.error("User not found");
        router.push("/");
      }
    };

    fetchUser();
  }, [router]);

  if (!user) {
    return (
      <div className="flex min-h-screen justify-center items-center text-center">
        <CursiveLogo isLoading />
      </div>
    );
  }

  return (
    <AppLayout
      withContainer={false}
      headerDivider
      header={
        <div className="flex items-center justify-between w-full py-4">
          <div className="flex flex-col">
            <span className="text-[30px] font-semibold tracking-[-0.22px] font-sans">{`${user.userData.username}`}</span>
            <span className="text-sm font-medium font-sans text-tertiary">
              {user.userData.displayName}
            </span>
          </div>
          <ProfileImage user={user.userData} />
        </div>
      }
      className="mx-auto py-4"
    >

      <div className="!divide-y !divide-quaternary/20 flex flex-col">

      </div>
    </AppLayout>
  );
};

export default LeaderboardPage;



/*import { AppContent } from "@/components/AppContent";
import { AppBackHeader } from "@/components/AppHeader";
import { Placeholder } from "@/components/placeholders/Placeholder";
import { LoadingWrapper } from "@/components/wrappers/LoadingWrapper";
import { useGetLeaderboard } from "@/hooks/useLeaderboard";
import { MAX_LEADERBOARD_LENGTH } from "@/hooks/useSettings";
import { getAuthToken } from "@/lib/client/localStorage";
import { classed } from "@tw-classed/react";
import React, { useEffect, useMemo, useState } from "react";

const TableWrapper = classed.div(
  "grid grid-cols-[25px_1fr_100px] items-center gap-4"
);
const TableHeaderLabel = classed.div(
  "text-iron-600 text-xs leading-4 font-bold uppercase"
);
const DisplayName = classed.span("text-iron-600 text-sm leading-5 font-bold");
const Point = classed.span("text-gray-900 text-sm");
const PositionCard = classed.div(
  "duration-200 text-white font-bold w-6 h-6 text-xs flex items-center justify-center rounded-full",
  {
    variants: {
      active: {
        false: "bg-white/20",
        true: "bg-white/50",
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

export default function LeaderBoard() {
  const authToken = useMemo(getAuthToken, []);
  const {
    isLoading,
    data: leaderboard = [],
    isRefetching,
  } = useGetLeaderboard(authToken);

  const [currentUserRank, setCurrentUserRank] = useState<number | undefined>();

  useEffect(() => {
    if (leaderboard) {
      let rank = 0;
      let prevConnections: Number | undefined;
      let skip = 1;

      for (let i = 0; i < leaderboard.length; i++) {
        const { connections, isCurrentUser } = leaderboard[i];

        if (i === 0 || connections !== prevConnections) {
          prevConnections = connections;
          rank += skip;
          skip = 1;
        } else {
          skip++;
        }

        if (isCurrentUser) {
          setCurrentUserRank(rank);
          break;
        }
      }
    }
  }, [leaderboard, isRefetching]);

  const getLeaderboardData = () => {
    let rank = 0;
    let prevConnections: Number | undefined;
    let skip = 1;

    return leaderboard
      .slice(0, MAX_LEADERBOARD_LENGTH)
      ?.map(({ name, connections, isCurrentUser }, index) => {
        if (index === 0 || connections !== prevConnections) {
          prevConnections = connections;
          rank += skip;
          skip = 1;
        } else {
          skip++;
        }

        return (
          <TableWrapper className="!grid-cols-[25px_1fr_35px]" key={index}>
            <PositionCard active={isCurrentUser}>{rank}</PositionCard>
            <DisplayName>
              <div className="flex items-center font-bold gap-2">
                <span>
                  {isCurrentUser ? (
                    <span className="text-white">{`${name} (you)`}</span>
                  ) : (
                    name
                  )}
                </span>
              </div>
            </DisplayName>

            <Point className="text-right">{connections}</Point>
          </TableWrapper>
        );
      });
  };

  const profileRank = `${currentUserRank} of ${leaderboard.length}`;
  const userLeaderboardItem = leaderboard.find((user) => user.isCurrentUser);
  const userInMainRank =
    currentUserRank && userLeaderboardItem
      ? currentUserRank <= MAX_LEADERBOARD_LENGTH
      : false;
  const loading = isLoading;

  return (
    <AppContent>
      <AppBackHeader
        actions={
          !loading &&
          currentUserRank && (
            <div className="flex gap-0.5 text-sm">
              <span className="text-white">Your rank:</span>
              <span className="text-white font-bold">{profileRank}</span>
            </div>
          )
        }
      />
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-4">
          <TableWrapper>
            <TableHeaderLabel className="text-center">#</TableHeaderLabel>
            <TableHeaderLabel>Display name</TableHeaderLabel>
            <TableHeaderLabel className="text-right">
              Total taps
            </TableHeaderLabel>
          </TableWrapper>
          <LoadingWrapper
            isLoading={isLoading}
            className="flex flex-col gap-[6px]"
            fallback={<Placeholder.List type="line" items={20} />}
          >
            {getLeaderboardData()}
            {!userInMainRank && (
              <div className="flex flex-col">
                <TableWrapper>
                  <PositionCard active>{currentUserRank}</PositionCard>
                  <DisplayName>
                    {userLeaderboardItem?.name}{" "}
                    <span className="text-white">(you)</span>
                  </DisplayName>
                  <Point className="text-right">
                    {userLeaderboardItem?.connections ?? 0}
                  </Point>
                </TableWrapper>
              </div>
            )}
          </LoadingWrapper>
        </div>
      </div>
    </AppContent>
  );
}

LeaderBoard.getInitialProps = () => {
  return { fullPage: true };
};*/
