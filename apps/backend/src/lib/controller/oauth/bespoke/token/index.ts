import { OAuthAppDetails, DATA_IMPORT_SOURCE } from "@types";

export async function stravaFetchToken(
  mapping: OAuthAppDetails,
  code: string
): Promise<globalThis.Response> {
  const { id, secret, token_url } = mapping;

  return fetch(token_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: id,
      client_secret: secret,
      code: code,
      grant_type: "authorization_code",
    }),
  });
}

export async function ghFetchToken(
  mapping: OAuthAppDetails,
  code: string
): Promise<globalThis.Response> {
  const { id, secret, token_url, redirect_uri } = mapping;

  return fetch(token_url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: id,
      client_secret: secret,
      code: code,
      redirect_uri: redirect_uri,
    }),
  });
}

export async function fetchToken(
  app: string,
  mapping: OAuthAppDetails,
  code: string
): Promise<globalThis.Response | null> {
  // Apps that can use server-side fetching
  switch (app) {
    case DATA_IMPORT_SOURCE.STRAVA:
      return await stravaFetchToken(mapping, code);
    case DATA_IMPORT_SOURCE.GITHUB:
      return await ghFetchToken(mapping, code);
    default:
      return null;
  }
}
