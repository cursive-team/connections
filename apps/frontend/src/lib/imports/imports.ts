import {
  AccessToken,
  ChipIssuer, DATA_IMPORT_SOURCE,
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
    // TODO: test your own:
    // user.email
    // TODO: does email need to be encoded in request?
    const response = await fetchImportedData(token, "steven.elleman@gmail.com", options);
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
  if (details.need_token) {
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
  }

  console.log("After access token")

  const canAuth: boolean = !details.need_token || accessToken !== null;

  if (canAuth && details.can_import) {
    const { user, session } = await storage.getUserAndSession();

    for (let option of details.data_options) {
      // TODO: Better data import option selection, which would include scope selection *before* the authorization code is fetched

      try {
        // TODO: Better chipIssuer selection when more communities added, how to decide community? Most recent?
        // get data once, save to each relevant communities?

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

