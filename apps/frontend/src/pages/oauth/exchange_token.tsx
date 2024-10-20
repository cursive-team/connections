import React, {useEffect} from "react";
import {useRouter} from "next/router";
import {importOAuthData, mintOAuthToken} from "@/lib/oauth";
import {toast} from "sonner";
import {CursiveLogo} from "@/components/ui/HeaderCover";
import {AccessToken, ChipIssuer} from "@types";
import {saveAccessToken} from "@/lib/storage/localStorage/oauth";
import {OAUTH_APP_MAPPING} from "@/config";
import {storage} from "@/lib/storage";

const OAuthAccessTokenPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchAccessToken = async () => {
      const { code, state } = router.query;

      const user = await storage.getUser();
      if (!user) {
        toast.error("User not found");
        router.push("/profile");
        return;
      }

      // TODO: need to exit if code / state missing -- add timer of some sort, after X seconds exits and error?

      if (code && state) {
        const codeStr = String(code);
        const stateStr = String(state);

        const accessToken: AccessToken | null = await mintOAuthToken(codeStr, stateStr);
        if (!accessToken) {
          toast.error("Unable to mint OAuth access token");
        } else {
          saveAccessToken(stateStr, accessToken);
        }

        if (accessToken) {
          const mapping = OAUTH_APP_MAPPING[stateStr];
          if (mapping) {
            // TODO: Need better (1) chipIssuer selection when more communities are added, (2) Data Option selection when more import options are available
            const leaderboardEntry = await importOAuthData(user.userData.username, ChipIssuer.EDGE_CITY_LANNA, accessToken, mapping.data_options[0]);

            // TODO: Insert LeaderboardEntry into DB
            console.log("Leaderboard Entry", leaderboardEntry);

            toast.success("Successfully minted OAuth token and imported data!");
          }
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