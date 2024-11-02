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
    case ImportDataType.GITHUB_LANNA_COMMITS:
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
    case ImportDataType.SOCIAL_LAYER_USER_GROUPS:
      let value3: string[] = data;
      return {
        ...userData,
        socialLayer: {
          memberships: value3,
        }
      };

    case ImportDataType.SOCIAL_LAYER_USER_EVENTS:
      let value4: Event[] = data;
      return {
        ...userData,
        socialLayer: {
          //events: value4, //TODO: fix this
        }
      };
    case ImportDataType.SOCIAL_LAYER_TICKET_ATTENDANCE:
      let value5: Record<string, boolean> = data;
      return {
        ...userData,
        socialLayer: {
          attendance: value5,
        }
      };

    default:
      return userData;
  }
};
