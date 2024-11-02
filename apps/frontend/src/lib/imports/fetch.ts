import {
  AccessToken,
  DataOption, ImportDataType,
  LeaderboardEntryType
} from "@types";
import { stravaFetch } from "@/lib/imports/integrations/strava";
import { ghFetch } from "@/lib/imports/integrations/github";
import {
  slUserAttendanceFetch,
  slUserEventsFetch,
  slUserGroupsFetch
} from "@/lib/imports/integrations/sociallayer";

export async function fetchImportedData(
  token: AccessToken | null,
  email: string | null,
  options: DataOption
): Promise<Response | null> {
  switch (options.type) {
    case ImportDataType.STRAVA_PREVIOUS_MONTH_RUN_DISTANCE:
      if (!token) {
        throw new Error("Missing oauth token")
        return null;
      }
      return await stravaFetch(token);
    case ImportDataType.GITHUB_LANNA_COMMITS:
      if (!token) {
        throw new Error("Missing oauth token")
        return null;
      }
      return await ghFetch(token);
    case ImportDataType.SOCIAL_LAYER_USER_GROUPS:
      if (!email) {
        throw new Error("Missing email")
        return null;
      }
      return await slUserGroupsFetch(email);
    case ImportDataType.SOCIAL_LAYER_USER_EVENTS:
      if (!email) {
        throw new Error("Missing email")
        return null;
      }
      return await slUserEventsFetch(email);
    case ImportDataType.SOCIAL_LAYER_TICKET_ATTENDANCE:
      if (!email) {
        throw new Error("Missing email")
        return null;
      }
      return await slUserAttendanceFetch(email);
    default:
      return null;
  }
}