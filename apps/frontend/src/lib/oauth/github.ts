import {
  ChipIssuer,
  LeaderboardEntryType,
  UpdateLeaderboardEntryRequest
} from "@types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function MapGithubCommitContributionsToLeaderboardEntry(authToken: string, chipIssuer: ChipIssuer, resp: any): UpdateLeaderboardEntryRequest {

  let commits: number = 0;

  if (resp && resp.data && resp.data.user && resp.data.user.contributionsCollection && resp.data.user.contributionsCollection.totalCommitContributions) {
    commits += resp.data.user.contributionsCollection.totalCommitContributions;
  }
  if (resp && resp.data && resp.data.user && resp.data.user.contributionsCollection && resp.data.user.contributionsCollection.totalIssueContributions) {
    commits += resp.data.user.contributionsCollection.totalIssueContributions;
  }
  if (resp && resp.data && resp.data.user && resp.data.user.contributionsCollection && resp.data.user.contributionsCollection.totalPullRequestContributions) {
    commits += resp.data.user.contributionsCollection.totalPullRequestContributions;
  }
  if (resp && resp.data && resp.data.user && resp.data.user.contributionsCollection && resp.data.user.contributionsCollection.totalPullRequestReviewContributions) {
    commits += resp.data.user.contributionsCollection.totalPullRequestReviewContributions;
  }

  return {
    authToken: authToken,
    chipIssuer: chipIssuer,
    entryValue: commits,
    entryType: LeaderboardEntryType.GITHUB_WEEK_OCT_20_COMMITS,
  }
}