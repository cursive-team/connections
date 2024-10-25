import {iOAuthClient} from "@/lib/controller/oauth/interfaces";
import {
  AccessToken,
  OAuthAppDetails,
  mapResponseToAccessToken
} from "@types";
import { OAUTH_APP_MAPPING } from "@/constants";
import { fetchToken } from "@/lib/controller/oauth/bespoke/token";


export class BespokeOAuthClient implements iOAuthClient {

  // NOTE: I attempted to use the same pattern (set method via prototype) but in this case it wasn't having it. Given that there is only one method, I figured it was okay to embed the method within the class.
  async MintOAuthToken(app: string, code: string): Promise<AccessToken | null> {
   try {
      if (!OAUTH_APP_MAPPING[app]) {
        throw new Error("OAuth app integration details are not available");
      }

      // Get app details and fetch access token
      const details: OAuthAppDetails = OAUTH_APP_MAPPING[app];

      const response = await fetchToken(app, details, code);

      if (!response) {
        throw new Error("OAuth access token response is null");
      }

      if (!response.ok || response.type == "error") {
        const errorResponse = await response.json();
        console.error(
          `HTTP error! status: ${response.status}, message: ${errorResponse.error}, consider checking environment variables`
        );
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorResponse.error}, consider checking environment variables`
        );
      }

      const accessToken = await mapResponseToAccessToken(app, response)
      return accessToken || null;
    } catch (error) {
      console.error("Error fetching access token:", error);
      throw error;
    }
  }
}