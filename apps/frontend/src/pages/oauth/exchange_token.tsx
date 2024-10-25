import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { getOAuthTokenViaClient, getOAuthTokenViaServer } from "@/lib/oauth";
import { toast } from "sonner";
import { CursiveLogo } from "@/components/ui/HeaderCover";
import {
  AccessToken,
  ChipIssuer,
  errorToString,
  DATA_IMPORT_SOURCE,
  OAuthAppDetails,
} from "@types";
import { OAUTH_APP_DETAILS } from "@/config";
import { storage } from "@/lib/storage";
import { importOAuthData } from "@/lib/oauth/imports";
import { updateLeaderboardEntry } from "@/lib/chip";
import { updateUserDataFromOAuth } from "@/lib/oauth/update";

async function getOAuthAccessToken(
  app: string,
  code: string,
  details: OAuthAppDetails
): Promise<AccessToken | null> {
  let token: AccessToken | undefined | null;

  // First check if access token already exists and is active in local storage
  token = await storage.getOAuthAccessToken(app);
  if (token) {
    // NOTE: when there are more scopes, check token scope, XOR save token by $app_$scope

    if (app === DATA_IMPORT_SOURCE.GITHUB) {
      // Github OAuth tokens do not expire, unless they have not been used for a year
      return token;
    }

    if (token.expires_at && token.expires_at * 1000 > Date.now()) {
      // Strava expires_at is in seconds. Data.now() is in milliseconds.
      return token;
    }
    // NOTE: Add refresh_token support
  }

  // Client-side access token fetching is preferred -- it prevents server (which is run by Cursive) from seeing access token in plaintext.
  // Server-side fetching will only use public scope to s
  try {
    if (details.client_side_fetching) {
      token = await getOAuthTokenViaClient(app, code);
    } else {
      token = await getOAuthTokenViaServer(app, code);
    }
  } catch (error) {
    console.error(
      "Minting OAuth token failed, check if code has expired",
      errorToString(error)
    );
    toast.error("Minting OAuth token failed, check if code has expired");
    return null;
  }

  if (!token) {
    toast.error("Unable to get OAuth access token");
    console.error("Minting OAuth token failed, check if code has expired");
    return null;
  }

  // Save access token and continue
  await storage.saveOAuthAccessToken(app, token);
  return token;
}

const OAuthAccessTokenPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchAccessToken = async () => {
      // TODO: Add some kind of timer, otherwise in theory could poll indefinitely
      const { code, state } = router.query;

      const user = await storage.getUser();
      if (!user) {
        toast.error("User not found");
        router.push("/profile");
        return;
      }

      if (code && state) {
        const codeStr = String(code);
        const stateStr = String(state);

        // This should never happen
        if (!OAUTH_APP_DETAILS || !OAUTH_APP_DETAILS[stateStr]) {
          toast.error("OAuth app integration details are not available");
          router.push("/profile");
          return;
        }

        // Get app details and fetch access token
        const details: OAuthAppDetails = OAUTH_APP_DETAILS[stateStr];

        const accessToken: AccessToken | null = await getOAuthAccessToken(
          stateStr,
          codeStr,
          details
        );
        if (!accessToken) {
          toast.error("Unable to mint OAuth access token");
          router.push("/profile");
          return;
        }

        if (accessToken && details.can_import) {
          // TODO: Better data import option selection, which would include scope selection *before* the authorization code is fetched
          const importOption = details.data_options[0];

          const { session } = await storage.getUserAndSession();

          // TODO: Better chipIssuer selection when more communities added
          // Unlike access token fetching, all data importing will be from client
          const leaderboardEntryRequest = await importOAuthData(
            session.authTokenValue,
            ChipIssuer.EDGE_CITY_LANNA,
            accessToken,
            importOption
          );

          try {
            if (!leaderboardEntryRequest) {
              throw new Error("Imported leaderboard entry is null");
            }
            const newUserData = await updateUserDataFromOAuth(
              user.userData,
              leaderboardEntryRequest.entryType,
              leaderboardEntryRequest.entryValue
            );
            await storage.updateUserData(newUserData);
            await updateLeaderboardEntry(leaderboardEntryRequest);
            toast.success("Successfully imported application data");
          } catch (error) {
            toast.error("OAuth data import failed");
            console.error("OAuth data import failed:", errorToString(error));
          }
        }

        router.push("/community");
      }
    };

    fetchAccessToken();
  }, [router]);

  return (
    <div className="flex min-h-screen justify-center items-center text-center">
      <CursiveLogo isLoading />
    </div>
  );
};

export default OAuthAccessTokenPage;
