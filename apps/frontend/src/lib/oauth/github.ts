import {
  ChipIssuer,
  LeaderboardEntryType,
  UpdateLeaderboardEntryRequest,
} from "@types";

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
