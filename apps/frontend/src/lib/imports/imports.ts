import {
  AccessToken,
  ChipIssuer,
  DataOption,
  errorToString,
  ImportDataType,
  OAuthAppDetails,
  RefreshRateType
} from "@types";
import { toast } from "sonner";
import { AppImport, User } from "@/lib/storage/types";
import { fetchImportedData } from "./fetch";
import { saveImportedData } from "./save";
import { OAUTH_APP_DETAILS } from "@/config";
import { storage } from "@/lib/storage";
import { getOAuthAccessToken } from "@/lib/oauth";

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

    // TODO: save data for each chip issuer?
    await saveImportedData(authToken, user, option, chipIssuers, response);
    return;
  } catch (error) {
    console.error("Error importing data:", errorToString(error));
    toast.error("Unable to import data");
    return;
  }
}

export function shouldRefreshImport(user: User, dataType: ImportDataType, refreshRate: RefreshRateType): boolean {
  if (!user.appImports) {
    user.appImports = {};
  }

  if (!user.appImports[dataType]) {
    // Need to go through button / oauth flow the first time to set up
    // TODO: handle
    throw new Error();
  }

  const appImport: AppImport | undefined = user.appImports[dataType];
  if (!appImport) {
    // TODO: handle
    throw new Error();
  }

  const lastImportedAt: Date = appImport.lastImportedAt;

  if (!lastImportedAt) {
    // TODO: handle
    // implies it hasn't been imported yet?
    throw new Error();
  }

  const now: Date = new Date();

  let millisecondDiff = now.getTime() - lastImportedAt.getTime();

  switch(refreshRate) {
    case RefreshRateType.DAILY:
      // if (now - lastImportedAt) > 1 day, return true
      let dayDiff = millisecondDiff / (1000 * 60 * 60 * 24);
      if (dayDiff > 1) {
        return true;
      }
      return false;
    case RefreshRateType.WEEKLY:
      // if (now - lastImportedAt) > 1 week, return true
      let weekDiff = millisecondDiff / (1000 * 60 * 60 * 24 * 7);
      if (weekDiff > 1) {
        return true;
      }
      return false;
    case RefreshRateType.MONTHLY:
      // if (now - lastImportedAt) > 1 month, return true
      let monthDiff = millisecondDiff / (1000 * 60 * 60 * 24 * 30);
      if (monthDiff > 1) {
        return true;
      }
      return false;
    default:
      throw new Error();
  }
}

export async function refreshData(): Promise<void> {

  const { user, session } = await storage.getUserAndSession();

  const apps = Object.keys(OAUTH_APP_DETAILS);

  for (const app of apps) {

    const details: OAuthAppDetails = OAUTH_APP_DETAILS[app];

    for (const option of details.data_options) {
      try {

        // Check if it's time to refresh import
        if (!shouldRefreshImport(user, option.type, option.refreshRate)) {
          continue;
        }

        const accessToken: AccessToken | undefined = await storage.getOAuthAccessToken(app.toString())

        if (!accessToken) {
          // need to go through oauth flow
          toast.error("")
          continue;
        }

        // TODO: fetch token
        const now: Date = new Date();
        const expiresAt: Date = new Date(accessToken.expires_at);

        if (accessToken.expires_at && now > expiresAt) {
          // TODO: refresh token
        }

        // Unlike access token fetching, all data importing will be from client
        await fetchAndSaveImportedData(
          session.authTokenValue,
          user,
          [ChipIssuer.EDGE_CITY_LANNA],
          accessToken,
          option
        );
      } catch (error) {
        toast.error("Data import failed");
        console.error("Data import failed:", errorToString(error));
        throw new Error(`Unable to mint OAuth access token: ${errorToString(error)}`);
        return;
      }
    }
  }
}

// TODO: only will be able to import data types with same scope
export async function importData(app: string, code: string): Promise<void> {

  // This should never happen
  if (!OAUTH_APP_DETAILS || !OAUTH_APP_DETAILS[app]) {
    toast.error("Application integration details are not available");
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
    toast.error("Unable to mint OAuth access token");
    throw new Error("Unable to mint OAuth access token")
    return;
  }

  if (accessToken && details.can_import) {
    const { user, session } = await storage.getUserAndSession();

    for (const option of details.data_options) {
      try {

        await storage.getChipIssuers();

        // TODO: for

        // Unlike access token fetching, all data importing will be from client

        // TODO: how to decouple chipIssuer, only is applied to leaderboards, should pass through all chipIssuers of user
        await fetchAndSaveImportedData(
          session.authTokenValue,
          user,
          ChipIssuer.EDGE_CITY_LANNA,
          accessToken,
          option
        );
      } catch (error) {
        toast.error("Data import failed");
        console.error("Data import failed:", errorToString(error));

        // HERE: not sure this error should be thrown
        throw new Error(`Unable to mint OAuth access token: ${errorToString(error)}`);
        return;
      }
    }
    toast.success("Successfully imported application data");
  }
}