import {AccessTokenSchema} from "@types";
import { OAUTH_APP_MAPPING } from "@/config";

export async function mintOAuthToken(
  code: string,
  app: string,
): Promise<{ access_token: string }> {
  try {
    if (!OAUTH_APP_MAPPING[app]) {
      throw new Error("Integration OAuth details are not available.");
    }

    const { id, secret, token_url } = OAUTH_APP_MAPPING[app];

    const response = await fetch(
      token_url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: id,
          client_secret: secret,
          code: code,
          grant_type: "authorization_code"
        }),
      }
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error(
        `HTTP error! status: ${response.status}, message: ${errorResponse.error}`
      );
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorResponse.error}`
      );
    }

    const data = await response.json();
    const parsedData = AccessTokenSchema.parse(data);

    return parsedData;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw error;
  }
}