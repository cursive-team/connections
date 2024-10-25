import React, {useEffect} from "react";
import {useRouter} from "next/router";
import {
  getOAuthTokenViaServer,
  getOAuthTokenViaClient
} from "@/lib/oauth";
import {toast} from "sonner";
import {CursiveLogo} from "@/components/ui/HeaderCover";
import {
  AccessToken,
  OAuthMapping
} from "@types";
import {saveAccessToken} from "@/lib/storage/localStorage/oauth";
import {OAUTH_APP_MAPPING} from "@/config";
import {storage} from "@/lib/storage";

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

        // This should never be the case
        if (!OAUTH_APP_MAPPING || !OAUTH_APP_MAPPING[stateStr]) {
          throw new Error("OAuth app integration details are not available")
        }

        // Get app details and fetch access token
        const details: OAuthMapping = OAUTH_APP_MAPPING[stateStr];

        let accessToken: AccessToken | null;

        // Client-side access token fetching is preferred -- it prevents server (which is run by Cursive) from seeing access token in plaintext.
        // Server-side fetching will only use public scope to s
        if (details.client_side_fetching) {
          accessToken = await getOAuthTokenViaClient(codeStr, stateStr);
        } else {
          accessToken = await getOAuthTokenViaServer(codeStr, stateStr);
        }

        if (!accessToken) {
          toast.error("Unable to mint OAuth access token");
          throw new Error("Unable to mint OAuth access token");
        } else {
          saveAccessToken(stateStr, accessToken);
        }

        if (accessToken) {
          // TODO: (1) Better chipIssuer selection when more communities added
          //  (2) Data option selection when more import options are available -- this should also include scope selection *before* the authorization code is fetched
          //  (3) Check for access token before authorization flow, must be of the correct scope too -- non-public scope should fail for server-side token fetching

          // Unlike access token fetching, all data importing will be from client
          //const leaderboardEntry = await importOAuthData(user.userData.username, ChipIssuer.EDGE_CITY_LANNA, accessToken, details.data_options[0]);

          toast.success("Successfully minted OAuth token");
        }

        router.push("/profile");
      }
    }

   fetchAccessToken();
  }, [router]);

  return (
    <div className="flex min-h-screen justify-center items-center text-center">
      <CursiveLogo isLoading />
    </div>
  );
}

export default OAuthAccessTokenPage;