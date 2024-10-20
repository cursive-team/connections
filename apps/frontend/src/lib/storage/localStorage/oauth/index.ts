import {
  deleteFromLocalStorage,
  getFromLocalStorage,
  saveToLocalStorage,
} from "@/lib/storage/localStorage/utils";
import {AccessToken, AccessTokenSchema} from "@types";

export const OAUTH_STORAGE_KEY = "oauth_access_token";

export const saveAccessToken = (app: string, token: AccessToken): void => {
  saveToLocalStorage(`${OAUTH_STORAGE_KEY}_${app}`, JSON.stringify(token));
};

export const getAccessToken = (app: string): AccessToken | undefined => {
  const accessTokenString = getFromLocalStorage(`${OAUTH_STORAGE_KEY}_${app}`);
  if (accessTokenString) {
    return AccessTokenSchema.parse(accessTokenString);
  }

  return undefined;
};

export const deleteSession = (app: string): void => {
  deleteFromLocalStorage(`${OAUTH_STORAGE_KEY}_${app}`);
};