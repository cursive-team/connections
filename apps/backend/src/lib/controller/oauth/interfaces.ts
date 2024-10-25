import {AccessToken} from "@types";

export interface iOAuthClient {
  MintOAuthToken(app: string, code: string): Promise<AccessToken | null>;
}