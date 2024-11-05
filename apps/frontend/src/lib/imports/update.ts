import { ImportDataType } from "@types";
import { UserData } from "@/lib/storage/types";

// Any way to generalize?
export const updateUserDataFromImportData = async (
  userData: UserData,
  type: ImportDataType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
): Promise<UserData> => {
  switch (type) {
    case ImportDataType.STRAVA_PREVIOUS_MONTH_RUN_DISTANCE:
      let value1: number = data;
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
      let value2: number = data;
      return {
        ...userData,
        github: {
          lannaCommits: {
            value: value2,
            lastUpdated: new Date()
          },
        },
      };
    case ImportDataType.GITHUB_CONTRIBUTIONS_LAST_YEAR:
      let value3: number = data;
      return {
        ...userData,
        github: {
          annualCommits: {
            value: value3,
            lastUpdated: new Date()
          },
        },
      };
    default:
      return userData;
  }
};