import {
  ChipIssuer,
  DataOption,
  UpdateLeaderboardEntryRequest,
  ImportDataType,
  errorToString,
  GithubReposResponseSchema,
  GithubReposResponse,
} from "@types";
import {
  MapStravaActivityStatsToLeaderboardEntryRequest,
} from "./integrations/strava";
import {
  MapGithubCommitContributionsToLeaderboardEntry,
} from "./integrations/github";
import { updateUserDataFromImportData } from "@/lib/imports/update";
import { storage } from "@/lib/storage";
import { User, UserData } from "@/lib/storage/types";
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
async function updateUserData(userData: UserData, importType: ImportDataType, data: any): Promise<void> {
  // Do not have backup type because leaderboard is chipIssuer-scoped, not user-scoped
  const newUserData = await updateUserDataFromImportData(
    userData,
    importType,
    data
  );
  await storage.updateUserData(newUserData);
  return;
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

  await updateUserData(user.userData, options.type, leaderboardEntryRequest.entryValue);

  await updateLeaderboardEntry(leaderboardEntryRequest);
  return;
}

export async function saveImportedData(authToken: string, user: User, option: DataOption, chipIssuers: ChipIssuer[], resp: Response): Promise<void> {
  try {
    const data = await resp.json();
    if (data && data.error) {
      throw new Error(
        `HTTP error! status: ${resp.status}, message: ${data.error}, consider checking environment variables or redirect_uri`
      );
    }

    switch (option.type) {
      case ImportDataType.STRAVA_PREVIOUS_MONTH_RUN_DISTANCE:
        for (const issuer of chipIssuers) {
          await saveLeaderboardEntries(option, authToken, user, issuer, data);
        }
        return;
      case ImportDataType.GITHUB_LANNA_CONTRIBUTIONS:
        for (const issuer of chipIssuers) {
          await saveLeaderboardEntries(option, authToken, user, issuer, data);
        }
        return;
      case ImportDataType.GITHUB_CONTRIBUTIONS_LAST_YEAR:
        for (const issuer of chipIssuers) {
          await saveLeaderboardEntries(option, authToken, user, issuer, data);
        }
        return;
      case ImportDataType.GITHUB_STARRED_REPOS:
        const repos1: GithubReposResponse = GithubReposResponseSchema.parse(data);
        const starredRepos: string[] = [];
        for (const repo of repos1) {
          const name: string | null = repo.full_name;
          if (!name) {
            continue;
          }
          starredRepos.push(name);
        }
        await updateUserData(user.userData, option.type, starredRepos);
        return;
      case ImportDataType.GITHUB_PROGRAMMING_LANGUAGES:
        const repos2: GithubReposResponse = GithubReposResponseSchema.parse(data);
        let languages: Record<string, string[]> = {};
        for (const repo of repos2) {
          const lang: string | null = repo.language;
          if (!lang) {
            continue;
          }

          if (!languages[lang]) {
            languages[lang] = [];
          }
          languages[lang].push(repo.full_name);
        }
        await updateUserData(user.userData, option.type, languages);
        return;
      default:
        return;
    }
  } catch (error) {
    console.error(`Error while saving imported data: ${errorToString(error)}`)
    return;
  }
}
