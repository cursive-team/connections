import { AccessToken, DataImportSource } from "@types";

export interface iOAuthClient {
  MintOAuthToken(app: DataImportSource, code: string): Promise<AccessToken | null>;
}