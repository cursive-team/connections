import { LeaderboardEntryType } from "@types";
import { UserData } from "@/lib/storage/types";

export const updateUserDataFromOAuth = async (
  userData: UserData,
  type: LeaderboardEntryType,
  value: number
): Promise<UserData> => {
  switch (type) {
    case LeaderboardEntryType.STRAVA_PREVIOUS_MONTH_RUN_DISTANCE:
      return {
        ...userData,
        strava: {
          previousMonthRunDistance: {
            value,
            lastUpdated: new Date(),
          },
        },
      };
    case LeaderboardEntryType.GITHUB_LANNA_COMMITS:
      return {
        ...userData,
        github: {
          lannaCommits: { value, lastUpdated: new Date() },
        },
      };
    default:
      return userData;
  }
};
