import {
  deleteFromLocalStorage,
  getFromLocalStorage,
  saveToLocalStorage,
} from "@/lib/storage/localStorage/utils";

export const OAUTH_STORAGE_KEY = "oauth_access_token";

export const saveAccessToken = (app: string, token: string): void => {
  saveToLocalStorage(`${OAUTH_STORAGE_KEY}_${app}`, token);
};

export const getAccessToken = (app: string): string | undefined => {
  const accessTokenString = getFromLocalStorage(`${OAUTH_STORAGE_KEY}_${app}`);
  if (accessTokenString) {
    return accessTokenString;
  }

  return undefined;
};

export const deleteSession = (app: string): void => {
  deleteFromLocalStorage(`${OAUTH_STORAGE_KEY}_${app}`);
};