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
    console.log(tapResponse);
    return tapResponse;
  } catch (error) {
    console.error(errorToString(error));
    throw new Error("Failed to get tap from chip");
  }
};
