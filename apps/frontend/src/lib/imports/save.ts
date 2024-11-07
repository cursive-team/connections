import {
  ChipIssuer,
  DataOption,
  UpdateLeaderboardEntryRequest,
  ImportDataType,
  errorToString,
} from "@types";
import {
  MapStravaActivityStatsToLeaderboardEntryRequest,
} from "./integrations/strava";
import {
  MapGithubCommitContributionsToLeaderboardEntry,
} from "./integrations/github";
import { updateUserDataFromImportData } from "@/lib/imports/update";
import { storage } from "@/lib/storage";
import { User } from "@/lib/storage/types";
import { updateLeaderboardEntry } from "@/lib/chip";


// Map response to entry for leaderboard
export function MapResponseToLeaderboardEntryRequest(
  authToken: string,
  type: ImportDataType,
  chipIssuer: ChipIssuer,
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  resp: any
): UpdateLeaderboardEntryRequest | null {
  switch (type) {
    case ImportDataType.STRAVA_PREVIOUS_MONTH_RUN_DISTANCE:
      return MapStravaActivityStatsToLeaderboardEntryRequest(
        authToken,
        chipIssuer,
        resp
      );
    case ImportDataType.GITHUB_LANNA_CONTRIBUTIONS:
      return MapGithubCommitContributionsToLeaderboardEntry(
        authToken,
        chipIssuer,
        resp
      );
    case ImportDataType.GITHUB_CONTRIBUTIONS_LAST_YEAR:
      return MapGithubCommitContributionsToLeaderboardEntry(
        authToken,
        chipIssuer,
        resp
      );
    default:
      // Probably should throw error
      return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function saveLeaderboardEntries(options: DataOption, authToken: string, user: User, chipIssuer: ChipIssuer, data: any): Promise<void> {
  const leaderboardEntryRequest: UpdateLeaderboardEntryRequest | null = MapResponseToLeaderboardEntryRequest(
    authToken,
    options.type,
    chipIssuer,
    data
  );

  if (!leaderboardEntryRequest) {
    throw new Error("Imported leaderboard entry is null");
  }

  const newUserData = await updateUserDataFromImportData(
    user.userData,
    options.type,
    leaderboardEntryRequest.entryValue
  );
  await storage.updateUserData(newUserData);
  await updateLeaderboardEntry(leaderboardEntryRequest);
  return;
}

export async function saveImportedData(authToken: string, user: User, option: DataOption, chipIssuer: ChipIssuer, resp: Response): Promise<void> {
  try {
    const data = await resp.json();
    if (data && data.error) {
      throw new Error(
        `HTTP error! status: ${resp.status}, message: ${data.error}, consider checking environment variables or redirect_uri`
      );
    }

    switch (option.type) {
      case ImportDataType.STRAVA_PREVIOUS_MONTH_RUN_DISTANCE:
        await saveLeaderboardEntries(option, authToken, user, chipIssuer, data);
        return;
      case ImportDataType.GITHUB_LANNA_CONTRIBUTIONS:
        await saveLeaderboardEntries(option, authToken, user, chipIssuer, data);
        return;
      case ImportDataType.GITHUB_CONTRIBUTIONS_LAST_YEAR:
        await saveLeaderboardEntries(option, authToken, user, chipIssuer, data);
        return;
      default:
        return;
    }
  } catch (error) {
    console.error(`Error while saving imported data: ${errorToString(error)}`)
    return;
  }
}
