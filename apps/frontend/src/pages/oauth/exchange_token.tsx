import React, {useEffect} from "react";
import {useRouter} from "next/router";
import {mintOAuthToken} from "@/lib/oauth";
import {toast} from "sonner";
import {CursiveLogo} from "@/components/ui/HeaderCover";
import {AccessToken} from "@types";
import {saveAccessToken} from "@/lib/storage/localStorage/oauth";

const OAuthAccessTokenPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchAccessToken = async () => {
      const { code, state } = router.query;

      // TODO: need to exit if code / state missing
      if (code && state) {
        const codeStr = String(code);
        const stateStr = String(state);

        const accessToken: AccessToken = await mintOAuthToken(codeStr, stateStr);
        if (!accessToken) {
          toast.error("Unable to mint OAuth access token");
        } else {
          toast.success("Successfully minted OAuth access token")
          saveAccessToken(stateStr, accessToken.access_token);
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