import {ChipIssuer, LeaderboardEntry, LeaderboardEntryType, UpdateLeaderboardEntryRequest} from "@types";


export function MapGithubCommitContributionsToLeaderboardEntry(authToken: string, chipIssuer: ChipIssuer, resp: any): UpdateLeaderboardEntryRequest {

  let commits: number = 0;

  if (resp && resp.data && resp.data.user && resp.data.user.contributionsCollection && resp.data.user.contributionsCollection.totalCommitContributions) {
    commits = resp.data.user.contributionsCollection.totalCommitContributions;
  }

  return {
    authToken: authToken,
    chipIssuer: chipIssuer,
    entryValue: commits,
    entryType: LeaderboardEntryType.GITHUB_WEEK_OCT_20_COMMITS,
  }
}