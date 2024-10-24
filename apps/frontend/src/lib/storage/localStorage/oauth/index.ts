import {
  deleteFromLocalStorage,
  getFromLocalStorage,
  saveToLocalStorage,
} from "@/lib/storage/localStorage/utils";
import {AccessToken, AccessTokenSchema, errorToString} from "@types";

export const OAUTH_STORAGE_KEY = "oauth_access_token";

export const saveAccessToken = (app: string, token: AccessToken): void => {
  saveToLocalStorage(`${OAUTH_STORAGE_KEY}_${app}`, JSON.stringify(token));
};

export const getAccessToken = (app: string): AccessToken | undefined => {
  const accessTokenString = getFromLocalStorage(`${OAUTH_STORAGE_KEY}_${app}`);
  if (accessTokenString) {
    try {
      return AccessTokenSchema.parse(JSON.parse(accessTokenString));
    } catch (error) {
      console.warn("Invalid access token, mint new one", errorToString(error))
      deleteAccessToken(accessTokenString);
      return undefined;
    }
  }

  return undefined;
};

export const deleteAccessToken = (app: string): void => {
  deleteFromLocalStorage(`${OAUTH_STORAGE_KEY}_${app}`);
};