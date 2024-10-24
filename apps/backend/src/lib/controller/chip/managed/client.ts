import { iChipClient } from "@/lib/controller/chip/interfaces";
import { PrismaClient } from "@prisma/client";
import {
  RegisterChipRequest,
  ChipTapResponse,
  TapParams,
  ChipIssuer,
  LeaderboardEntry,
  LeaderboardEntryType,
} from "@types";
import { Chip } from "@/lib/controller/chip/types";

// NOTE: Hoist all prototype methods -- if you do not import the method file, the method(s) will evaluate to undefined at runtime
import("@/lib/controller/chip/managed/update");
import("@/lib/controller/chip/managed/leaderboard");
import("@/lib/controller/chip/managed/register");
import("@/lib/controller/chip/managed/tap");

export class ManagedChipClient implements iChipClient {
  prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = new PrismaClient();
  }

  // @ts-expect-error (ts2391: function implementation does not immediately follow declaration)
  RegisterChip(registerChip: RegisterChipRequest): Promise<Chip>;

  // @ts-expect-error (ts2391)
  GetTapFromChip(tapParams: TapParams): Promise<ChipTapResponse>;

  // @ts-expect-error (ts2391)
  UpdateChip(updateChip: UpdateChipRequest): Promise<Chip>;


  // TODO: Method takes UserData and checks if Chip has been updated s.g. the UserData should be updated (e.g. attendance).
  //  If the Chip has been updated, return updated value, else null
  // @ts-expect-error (ts2391)
  CheckUserData(userData: UserData): Promise<UserData | null>;

  // @ts-expect-error (ts2391)
  UpdateLeaderboardEntry(
    username: string,
    chipIssuer: ChipIssuer,
    entryType: LeaderboardEntryType,
    entryValue: number
  ): Promise<void>;

  // @ts-expect-error (ts2391)
  GetLeaderboardTotalValue(
    chipIssuer: ChipIssuer,
    entryType: LeaderboardEntryType
  ): Promise<number | null>;

  // @ts-expect-error (ts2391)
  GetLeaderboardTotalContributors(
    chipIssuer: ChipIssuer,
    entryType: LeaderboardEntryType
  ): Promise<number | null>;

  // @ts-expect-error (ts2391)
  GetUserLeaderboardPosition(
    username: string,
    chipIssuer: ChipIssuer,
    entryType: LeaderboardEntryType
  ): Promise<number | null>;

  // @ts-expect-error (ts2391)
  GetTopLeaderboardEntries(
    chipIssuer: ChipIssuer,
    entryType: LeaderboardEntryType,
    count: number | undefined
  ): Promise<LeaderboardEntry[] | null>;
}
