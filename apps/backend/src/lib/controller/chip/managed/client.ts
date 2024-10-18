import { iChipClient } from "@/lib/controller/chip/interfaces";
import { PrismaClient } from "@prisma/client";
import {
  RegisterChipRequest,
  ChipTapResponse,
  TapParams,
  ChipIssuer,
  LeaderboardEntry,
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

  // @ts-expect-error (ts2391)
  GetLeaderboardEntry(
    username: string,
    chipIssuer: ChipIssuer
  ): Promise<LeaderboardEntry | null>;

  // @ts-expect-error (ts2391)
  UpdateLeaderboardEntry(
    username: string,
    chipIssuer: ChipIssuer
  ): Promise<void>;

  // @ts-expect-error (ts2391)
  GetLeaderboardTotalTaps(
    chipIssuer: ChipIssuer
  ): Promise<number | null>;

  // @ts-expect-error (ts2391)
  GetLeaderboardTotalContributors(
    chipIssuer: ChipIssuer
  ): Promise<number | null>;

  // @ts-expect-error (ts2391)
  GetUserLeaderboardPosition(
    username: string,
    chipIssuer: ChipIssuer
  ): Promise<number | null>;

  // @ts-expect-error (ts2391)
  GetTopLeaderboard(
    count: number,
    chipIssuer: ChipIssuer
  ): Promise<LeaderboardEntry[] | null>;
}
