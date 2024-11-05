import {
  AccessToken,
  ChipIssuer,
  DataOption,
  errorToString, OAuthAppDetails
} from "@types";
import { toast } from "sonner";
import { User } from "@/lib/storage/types";
import { fetchImportedData } from "./fetch";
import { saveImportedData } from "./save";
import { OAUTH_APP_DETAILS } from "@/config";
import { storage } from "@/lib/storage";
import { getOAuthAccessToken } from "@/lib/oauth";

export async function fetchAndSaveImportedData(
  authToken: string,
  user: User,
  chipIssuer: ChipIssuer,
  token: AccessToken | null,
  options: DataOption
): Promise<void> {
  try {
    const response = await fetchImportedData(token, options);
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
    await saveImportedData(authToken, user, options, chipIssuer, response);
    return;
  } catch (error) {
    console.error("Error importing data:", errorToString(error));
    toast.error("Unable to import data");
    return;
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
        // TODO: Need to specify data imports per community

        // Unlike access token fetching, all data importing will be from client
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
        throw new Error(`Unable to mint OAuth access token: ${errorToString(error)}`);
        return;
      }
    }
    toast.success("Successfully imported application data");
  }
}