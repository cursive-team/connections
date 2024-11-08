import { ChipTapResponse, errorToString, TapParams } from "@types";
import { ManagedChipClient } from "../client";
import { generateTapSignatureFromChip } from "../util";

ManagedChipClient.prototype.GetTapFromChip = async function (
  tapParams: TapParams
): Promise<ChipTapResponse> {
  try {
    const tapResponse = await generateTapSignatureFromChip(
      this.prismaClient,
      tapParams
    );
    return tapResponse;
  } catch (error) {
    // Want to surface specific tap error to user
    console.error(errorToString(error));
    throw error;
  }
};
