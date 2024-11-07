import {
  AccessToken,
  ChipIssuer, GithubStarredRepo,
  GithubUserResponse,
  GithubUserResponseSchema,
  GithubReposResponse,
  GithubReposResponseSchema,
  LeaderboardEntryType,
  UpdateLeaderboardEntryRequest,
} from "@types";

/*
GITHUB RATELIMITS:

```
You can use a personal access token to make API requests. Additionally, you can authorize a GitHub App or OAuth app, which can then make API requests on your behalf.

All of these requests count towards your personal rate limit of 5,000 requests per hour.
```
(https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api?apiVersion=2022-11-28#primary-rate-limit-for-authenticated-users)
 */

export async function ghFetchUsername(token: AccessToken): Promise<string> {
  const user = await fetch("https://api.github.com/user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.access_token}`,
    },
  });

  const rawUser = await user.json();

  const resp: GithubUserResponse = GithubUserResponseSchema.parse(rawUser);

  return resp.login;
}

// TODO: just return Response
export async function ghFetchUserStarredRepos(token: AccessToken, username: string): Promise<GithubStarredRepo[]> {
  const user = await fetch(`https://api.github.com/users/${username}/starred`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      Authorization: `Bearer ${token.access_token}`,
    },
  });

  const rawRepos = await user.json();

  const resp: GithubReposResponse = GithubReposResponseSchema.parse(rawRepos);

  /*

  TODO: iterate through, tally languages, sort by order

   */

  return resp.repos;
}

// TODO: to get programming languages: https://stackoverflow.com/a/70349623
export async function ghFetchUserRepos(token: AccessToken, username: string): Promise<Response | null> {
  console.log("User repos")

  const user = await fetch(`https://api.github.com/users/${username}/repos`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      Authorization: `Bearer ${token.access_token}`,
    },
  });

  const rawRepos = await user.json();

  const resp: GithubReposResponse = GithubReposResponseSchema.parse(rawRepos);

  return null;
}

export async function ghFetchContributions(token: AccessToken, from: Date, to: Date): Promise<Response | null> {
  const username = await ghFetchUsername(token);

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

  console.log("Fetch GH contributions: ", response)

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

export async function ghFetchStarredRepos(token: AccessToken): Promise<Response | null> {
  const username = await ghFetchUsername(token);

  const repos: string = await ghFetchUserStarredRepos(token, username);

  return null;
}

export async function ghFetchRepos(token: AccessToken): Promise<Response | null> {
  const username = await ghFetchUsername(token);

  const repos: string = await ghFetchUserRepos(token, username);

  return null;
}
