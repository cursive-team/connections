import {
  AccessToken,
  ChipIssuer,
  GithubUserResponse,
  GithubUserResponseSchema,
  LeaderboardEntryType,
  UpdateLeaderboardEntryRequest,
} from "@types";


export async function ghFetch(token: AccessToken): Promise<Response | null> {
  const user = await fetch("https://api.github.com/user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.access_token}`,
    },
  });

  const rawUser = await user.json();

  const resp: GithubUserResponse = GithubUserResponseSchema.parse(rawUser);

  const username = resp.login;
  // NOTE: month is 0-indexed
  const from = new Date(2024, 9, 10); // Oct 10, 2024
  const to = new Date(2024, 10, 10); // Nov 10, 2024

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
    }`;

  const variables = `
    {
      "username": "${username}",
      "from": "${from.toISOString()}",
      "to": "${to.toISOString()}"
    }`;

  const body = {
    query,
    variables,
  };

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
    body: JSON.stringify(body),
  });

  return response;
}

export function MapGithubCommitContributionsToLeaderboardEntry(
  authToken: string,
  chipIssuer: ChipIssuer,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resp: any
): UpdateLeaderboardEntryRequest {
  let commits: number = 0;

  if (resp?.data?.user?.contributionsCollection?.totalCommitContributions) {
    commits += resp.data.user.contributionsCollection.totalCommitContributions;
  }
  if (resp?.data?.user?.contributionsCollection?.totalIssueContributions) {
    commits += resp.data.user.contributionsCollection.totalIssueContributions;
  }
  if (
    resp?.data?.user?.contributionsCollection?.totalPullRequestContributions
  ) {
    commits +=
      resp.data.user.contributionsCollection.totalPullRequestContributions;
  }
  if (
    resp?.data?.user?.contributionsCollection
      ?.totalPullRequestReviewContributions
  ) {
    commits +=
      resp.data.user.contributionsCollection
        .totalPullRequestReviewContributions;
  }

  return {
    authToken: authToken,
    chipIssuer: chipIssuer,
    entryValue: commits,
    entryType: LeaderboardEntryType.GITHUB_LANNA_COMMITS,
  };
}
