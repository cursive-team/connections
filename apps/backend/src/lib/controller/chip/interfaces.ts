import {
  RegisterChipRequest,
  ChipTapResponse,
  TapParams,
  ChipIssuer,
  UpdateChipRequest,
  LeaderboardEntry,
  LeaderboardEntryType,
} from "@types";
import { Chip } from "./types";

export interface iChipClient {
  RegisterChip(registerChip: RegisterChipRequest): Promise<Chip>;
  UpdateChip(updateChip: UpdateChipRequest): Promise<Chip>;
  GetTapFromChip(tapParams: TapParams): Promise<ChipTapResponse>;
  GetLeaderboardEntry(
    username: string,
    chipIssuer: ChipIssuer
  ): Promise<LeaderboardEntry | null>;
  UpdateLeaderboardEntry(
    username: string,
    chipIssuer: ChipIssuer,
    entryType: LeaderboardEntryType,
    entryValue: number
  ): Promise<void>;
  GetLeaderboardTotalTaps(chipIssuer: ChipIssuer): Promise<number | null>;
  GetLeaderboardTotalContributors(
    chipIssuer: ChipIssuer
  ): Promise<number | null>;
  GetUserLeaderboardPosition(
    username: string,
    chipIssuer: ChipIssuer
  ): Promise<number | null>;
  GetTopLeaderboard(
    count: number | undefined,
    chipIssuer: ChipIssuer
  ): Promise<LeaderboardEntry[] | null>;
}
