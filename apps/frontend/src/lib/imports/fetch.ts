import {
  AccessToken,
  DataOption,
  ImportDataType
} from "@types";
import { stravaFetch } from "@/lib/imports/integrations/strava";
import { ghFetch } from "@/lib/imports/integrations/github";

export async function fetchImportedData(
  token: AccessToken | null,
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
    default:
      return null;
  }
}