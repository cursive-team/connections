import {
  AccessToken,
  DataOption,
  ImportDataType
} from "@types";
import { stravaFetch } from "@/lib/imports/integrations/strava";
import { ghFetchContributions } from "@/lib/imports/integrations/github";

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
    case ImportDataType.GITHUB_LANNA_CONTRIBUTIONS:
      if (!token) {
        throw new Error("Missing oauth token")
        return null;
      }
      // NOTE: month is 0-indexed
      const from1 = new Date(2024, 9, 10); // Oct 10, 2024
      const to1 = new Date(2024, 10, 10); // Nov 10, 2024

      return await ghFetchContributions(token, from1, to1);
    case ImportDataType.GITHUB_CONTRIBUTIONS_LAST_YEAR:
      if (!token) {
        throw new Error("Missing oauth token")
        return null;
      }
      // NOTE: month is 0-indexed
      const from2 = new Date(2023, 10, 15); // Nov 15, 2023
      const to2 = new Date(2024, 10, 15); // Nov 15, 2024

      return await ghFetchContributions(token, from2, to2);
    default:
      return null;
  }
}