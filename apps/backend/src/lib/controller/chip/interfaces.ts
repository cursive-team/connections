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
  UpdateLeaderboardEntry(
    username: string,
    chipIssuer: ChipIssuer,
    entryType: LeaderboardEntryType,
    entryValue: number
  ): Promise<void>;
  GetLeaderboardTotalValue(
    chipIssuer: ChipIssuer,
    entryType: LeaderboardEntryType
  ): Promise<number | null>;
  GetLeaderboardTotalContributors(
    chipIssuer: ChipIssuer,
    entryType: LeaderboardEntryType
  ): Promise<number | null>;
  GetUserLeaderboardPosition(
    username: string,
    chipIssuer: ChipIssuer,
    entryType: LeaderboardEntryType
  ): Promise<number | null>;
  GetTopLeaderboardEntries(
    chipIssuer: ChipIssuer,
    entryType: LeaderboardEntryType,
    count: number | undefined
  ): Promise<LeaderboardEntry[] | null>;
}
