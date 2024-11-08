import {
  AccessToken,
  ChipIssuer,
  DataImportSource,
  DataOption,
  errorToString,
  ImportDataType,
  OAuthAppDetails,
  RefreshRateType
} from "@types";
import { toast } from "sonner";
import { User, UserData } from "@/lib/storage/types";
import { fetchImportedData } from "./fetch";
import { saveImportedData } from "./save";
import { OAUTH_APP_DETAILS } from "@/config";
import { storage } from "@/lib/storage";
import { getOAuthAccessToken } from "@/lib/oauth";
import { getChipIssuers } from "@/lib/storage/localStorage/user/chip";
import { SupportToast } from "@/components/ui/SupportToast";
import { ERROR_SUPPORT_CONTACT } from "@/constants";

export async function fetchAndSaveImportedData(
  authToken: string,
  user: User,
  chipIssuers: ChipIssuer[],
  token: AccessToken | null,
  option: DataOption
): Promise<void> {
  try {
    const response = await fetchImportedData(token, option);
    if (!response) {
      throw new Error("No response from data import");
    }

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error(
        `HTTP error! status: ${response.status}, message: ${errorResponse.error}`
      );
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorResponse.error}`
      );
    }

    await saveImportedData(authToken, user, option, chipIssuers, response);
    return;
  } catch (error) {
    // On error, delete access token -- the token may have been revoked
    // By deleting the access token we'll fetch a new one on a re-attempt
    // If it got to this stage, the token should not have expired
    storage.deleteOAuthAccessToken(option.type);
    console.error("Error importing data:", errorToString(error));
    // As this toast will only be shown once, keep it
    toast.error("Import failed, token removed. Rerun if token was revoked.");
    return;
  }
}

export function getUserDataUpdatedAt(userData: UserData, dataType: ImportDataType): Date | undefined {
    let lastImportedAt: Date | undefined = undefined;
    switch (dataType) {
      case ImportDataType.STRAVA_PREVIOUS_MONTH_RUN_DISTANCE:
        lastImportedAt = userData?.strava?.previousMonthRunDistance?.lastUpdated;
        break;
      case ImportDataType.GITHUB_LANNA_CONTRIBUTIONS:
        lastImportedAt = userData?.github?.lannaCommits?.lastUpdated;
        break;
      case ImportDataType.GITHUB_CONTRIBUTIONS_LAST_YEAR:
        lastImportedAt = userData?.github?.annualCommits?.lastUpdated;
        break;
      case ImportDataType.GITHUB_STARRED_REPOS:
        lastImportedAt = userData?.github?.starredRepos?.lastUpdated;
        break;
      case ImportDataType.GITHUB_PROGRAMMING_LANGUAGES:
        lastImportedAt = userData?.github?.programmingLanguages?.lastUpdated;
        break;
      default:
        console.error("Import type not recognized.")
        throw new Error("Import type not recognized.")
    }
    return lastImportedAt;
}

export function isOverdueToReimport(lastImportedAt: Date, refreshRate: RefreshRateType): boolean {
  const now: Date = new Date();

  const millisecondDiff = now.getTime() - lastImportedAt.getTime();
  let dayDiff: number = 0;

  switch(refreshRate) {
    case RefreshRateType.DAILY:
      // if (now - lastImportedAt) > 1 day, return true
      dayDiff = millisecondDiff / (1000 * 60 * 60 * 24);
      if (dayDiff > 1) {
        return true;
      }
      return false;
    case RefreshRateType.WEEKLY:
      // if (now - lastImportedAt) > 1 week, return true
      const weekDiff = millisecondDiff / (1000 * 60 * 60 * 24 * 7);
      if (weekDiff > 1) {
        return true;
      }
      return false;
    case RefreshRateType.MONTHLY:
      // if (now - lastImportedAt) > 1 month, return true
      const monthDiff = millisecondDiff / (1000 * 60 * 60 * 24 * 30);
      if (monthDiff > 1) {
        return true;
      }
      return false;
    case RefreshRateType.TESTING:
      // if (now - lastImportedAt) > 30 seconds, return true
      const secondsDiff = millisecondDiff / 1000;
      if (secondsDiff > 30) {
        return true;
      }
      return false;
    default:
      throw new Error();
  }
}

export function shouldRefreshImport(user: User, dataType: ImportDataType, refreshRate: RefreshRateType): boolean {
  try {
    const lastImportedAt: Date | undefined = getUserDataUpdatedAt(user.userData, dataType);

    if (!lastImportedAt) {
      // This case happens when value needs to be backfilled
      return true;
    }

    return isOverdueToReimport(lastImportedAt, refreshRate);
  } catch (error) {
    console.error(`Error while evaluating if data type should be refreshed: ${errorToString(error)}`);
    return false;
  }
}

export async function refreshData(): Promise<void> {
  try {
    const { user, session } = await storage.getUserAndSession();

    const apps = Object.keys(OAUTH_APP_DETAILS);
    const chipIssuers: ChipIssuer[] = await getChipIssuers();

    for (const app of apps) {

      const appStr: string = app.toString();
      const capitalized: string = appStr.charAt(0).toUpperCase() + appStr.substring(1);

      const details: OAuthAppDetails = OAUTH_APP_DETAILS[app];

      for (const option of details.data_options) {

        // Check if it's time to refresh import
        if (!shouldRefreshImport(user, option.type, option.refreshRate)) {
          continue;
        }

        // This may be empty if the token expired and needs to be regranted
        const accessToken: AccessToken | undefined = await storage.getOAuthAccessToken(app.toString())

        if (!accessToken && (!user.oauth || !user.oauth[app])) {
          // In this case, have not consented to importing data yet. Skip.
          continue;
        } else if (!accessToken) {
          console.error("Access token is empty.");
          continue;
        }

        const now: Date = new Date();
        // Assume expires at is in milliseconds
        let expiresAt: Date = new Date(accessToken.expires_at);

        // Strava's expiration is seconds rather than milliseconds
        if (app === DataImportSource.STRAVA) {
          expiresAt = new Date(accessToken.expires_at * 1000);
        }

        if (accessToken.expires_at && now > expiresAt) {
          // TODO: swap to use refresh token
          storage.deleteOAuthAccessToken(option.type);
          // As this toast will only be shown once, keep it
          toast.error(`${capitalized} token has expired, go through OAuth flow again.`, {duration: 5000});
          continue;
        }

        // Unlike access token fetching, all data importing will be from client
        await fetchAndSaveImportedData(
          session.authTokenValue,
          user,
          chipIssuers,
          accessToken,
          option
        );
      }
    }
    return;
  } catch (error) {
    console.error("Data import failed:", errorToString(error));
    throw new Error(`Data import failed: ${errorToString(error)}`);
    return;
  }
}

// Used for OAuth flow, as the operation is
export async function importData(app: string, code: string): Promise<void> {

  // This should never happen
  if (!OAUTH_APP_DETAILS || !OAUTH_APP_DETAILS[app]) {
    return;
  }

  // Get app details and fetch access token
  const details: OAuthAppDetails = OAUTH_APP_DETAILS[app];

  let accessToken: AccessToken | null = null;
  accessToken = await getOAuthAccessToken(
    app,
    code,
    details
  );
  if (!accessToken) {
    SupportToast(
      "",
      true,
      "Unable to mint OAuth access token.",
      ERROR_SUPPORT_CONTACT,
      ""
    )
    throw new Error("Unable to mint OAuth access token")
    return;
  }

  if (accessToken && details.can_import) {
    const { user, session } = await storage.getUserAndSession();

    // Import all data options for given app and app access token
    for (const option of details.data_options) {
      try {

        const chipIssuers: ChipIssuer[] = await storage.getChipIssuers();

        await fetchAndSaveImportedData(
          session.authTokenValue,
          user,
          chipIssuers,
          accessToken,
          option
        );
      } catch (error) {
        SupportToast(
          "",
          true,
          "Data import failed.",
          ERROR_SUPPORT_CONTACT,
          errorToString(error)
        )
        console.error("Data import failed:", errorToString(error));
        throw new Error(`Data import failed: ${errorToString(error)}`);
        return;
      }
    }
  }
}