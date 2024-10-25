import {
  AccessToken,
  ChipIssuer,
  DataOption,
  LeaderboardEntryType,
  UpdateLeaderboardEntryRequest,
  GithubUserResponse,
  GithubUserResponseSchema,
  errorToString
} from "@types";
import {toast} from "sonner";

import {
  MapStravaActivityStatsToLeaderboardEntryRequest
} from "./strava";

import {
  MapGithubCommitContributionsToLeaderboardEntry
} from "./github";

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export function MapResponseToLeaderboardEntryRequest(authToken: string, type: LeaderboardEntryType, chipIssuer: ChipIssuer, resp: any): UpdateLeaderboardEntryRequest | null {
  switch(type) {
    case LeaderboardEntryType.STRAVA_PREVIOUS_MONTH_RUN_DISTANCE:
      return MapStravaActivityStatsToLeaderboardEntryRequest(authToken, chipIssuer, resp);
    case LeaderboardEntryType.GITHUB_WEEK_OCT_20_COMMITS:
      return MapGithubCommitContributionsToLeaderboardEntry(authToken, chipIssuer, resp);
    default:
      // Probably should throw error
      return null;
  }
}


async function fetchData(token: AccessToken, options: DataOption): Promise<Response | null> {
  switch(options.type) {
    case LeaderboardEntryType.STRAVA_PREVIOUS_MONTH_RUN_DISTANCE:
      return await stravaFetch(token);
    case LeaderboardEntryType.GITHUB_WEEK_OCT_20_COMMITS:
      return await ghFetch(token);
    default:
      return null;
  }
}

async function stravaFetch(token: AccessToken): Promise<Response> {
  return fetch(
    `https://www.strava.com/api/v3/athletes/${token.user_id}/stats`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token.access_token}`,
      },
    }
  );
}

async function ghFetch(token: AccessToken): Promise<Response | null> {
  const user = await fetch(
    "https://api.github.com/user",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token.access_token}`,
      },
    }
  );

  const rawUser = await user.json();

  const resp: GithubUserResponse = GithubUserResponseSchema.parse(rawUser);

  const username = resp.login;
  // NOTE: with the exception of year, values are indices
  const from = new Date(2024, 9, 21); // Oct 20, 2024
  const to = new Date(2024, 9, 28); // Oct 27, 2024

  // TODO: find graphgl library for handling query / variables
  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username){
        contributionsCollection(from: $from, to: $to) {
          totalCommitContributions
          totalIssueContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
        }
      }
    }`

  const variables = `
    {
      "username": "${username}",
      "from": "${from.toISOString()}",
      "to": "${to.toISOString()}"
    }`

  const body = {
    query,
    variables
  }

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
    body: JSON.stringify(body)
  });

  return response;
}

export async function importOAuthData(
  authToken: string,
  chipIssuer: ChipIssuer,
  token: AccessToken,
  options: DataOption,
): Promise<UpdateLeaderboardEntryRequest | null> {

  try {
    const response = await fetchData(token, options);
    if (!response) {
      throw new Error("No response from OAuth import");
    }
    
    if (!response.ok) {
      const errorResponse = await response.json();
      console.error(
        `HTTP error! status: ${response.status}, message: ${errorResponse.error}`
      );
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorResponse.error}`
      );
    }

    const data = await response.json();
    if (data && data.error) {
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${data.error}, consider checking environment variables or redirect_uri`
      );
    }

    // Map response to LeaderboardEntry for each type
    return MapResponseToLeaderboardEntryRequest(authToken, options.type, chipIssuer, data);
  } catch (error) {
    console.error("Error importing data:", errorToString(error));
    toast.error("Unable to import OAuth data");
    return null;
  }
}