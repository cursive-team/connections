import { ImportDataType } from "@types";
import { UserData } from "@/lib/storage/types";

// Add import types to UserData, backup is already provided for any UserData changes
export const updateUserDataFromImportData = async (
  userData: UserData,
  type: ImportDataType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
): Promise<UserData> => {
  switch (type) {
    case ImportDataType.STRAVA_PREVIOUS_MONTH_RUN_DISTANCE:
      const value1: number = data;
      return {
        ...userData,
        strava: {
          previousMonthRunDistance: {
            value: value1,
            lastUpdated: new Date(),
          },
        },
      };
    case ImportDataType.GITHUB_LANNA_CONTRIBUTIONS:
      const value2: number = data;
      return {
        ...userData,
        github: {
          ...userData.github,
          lannaCommits: {
            value: value2,
            lastUpdated: new Date()
          },
        },
      };
    case ImportDataType.GITHUB_CONTRIBUTIONS_LAST_YEAR:
      const value3: number = data;
      return {
        ...userData,
        github: {
          ...userData.github,
          annualCommits: {
            value: value3,
            lastUpdated: new Date()
          },
        },
      };
    case ImportDataType.GITHUB_STARRED_REPOS:
      let value4: string[] = data;
      if (!value4) {
        value4 = [];
      }
      return {
        ...userData,
        github: {
          ...userData.github,
          starredRepos: {
            value: value4,
            lastUpdated: new Date()
          },
        },
      };
    case ImportDataType.GITHUB_PROGRAMMING_LANGUAGES:
      let value5: Record<string, string[]> = data;
      if (!value5) {
        value5 = {};
      }
      return {
        ...userData,
        github: {
          ...userData.github,
          programmingLanguages: {
            value: value5,
            lastUpdated: new Date()
          },
        },
      };
    default:
      return userData;
  }
};