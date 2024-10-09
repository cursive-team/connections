import {
  RegisterChipRequest,
  ChipTapResponse,
  TapParams,
  ChipIssuer,
} from "@types";
import { Chip } from "./types";

export interface iChipClient {
  RegisterChip(registerChip: RegisterChipRequest): Promise<Chip>;
  GetTapFromChip(tapParams: TapParams): Promise<ChipTapResponse>;
  UpdateLeaderboardEntry(
    username: string,
    chipIssuer: ChipIssuer
  ): Promise<void>;
}
