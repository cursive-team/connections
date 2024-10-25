import {iOAuthClient} from "@/lib/controller/oauth/interfaces";
import {
  AccessToken,
  mapResponseToAccessToken,
  OAuthAppDetails
} from "@types";
import { OAUTH_APP_DETAILS } from "@/constants";
import { fetchToken } from "@/lib/controller/oauth/bespoke/token";


export class BespokeOAuthClient implements iOAuthClient {

  // NOTE: I attempted to use the same pattern (set method via prototype) but in this case it wasn't having it. Given that there is only one method, I figured it was okay to embed the method within the class.
  async MintOAuthToken(app: string, code: string): Promise<AccessToken | null> {
   try {
      if (!OAUTH_APP_DETAILS[app]) {
        throw new Error("OAuth app integration details are not available");
      }

      // Get app details and fetch access token
      const details: OAuthAppDetails = OAUTH_APP_DETAILS[app];

      const response = await fetchToken(app, details, code);

      if (!response) {
        throw new Error("OAuth access token response is null");
      }

      if (!response.ok || response.type == "error") {
        const errorResponse = await response.json();
        console.error(
          `HTTP error! status: ${response.status}, message: ${errorResponse.error}, consider checking environment variables or redirect_uri`
        );
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorResponse.error}, consider checking environment variables or redirect_uri`
        );
      }

      const data = await response.json();
      if (data && data.error) {
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${data.error}, consider checking environment variables or redirect_uri`
        );
      }

      const accessToken = await mapResponseToAccessToken(app, data)
      return accessToken || null;
    } catch (error) {
      console.error("Error fetching access token:", error);
      return null;
    }
  }
}