import { UpdateChipRequest } from "@types";
import { Chip, ChipSchema } from "../../types";
import { ManagedChipClient } from "../client";
import { getChipFromTapParams } from "../util";

ManagedChipClient.prototype.UpdateChip = async function (
  updateChip: UpdateChipRequest
): Promise<Chip> {
  const chip = await getChipFromTapParams(
    this.prismaClient,
    updateChip.tapParams
  );

  if (!chip) {
    throw new Error("Chip not found");
  }

  // Update the chip with registration information
  const updatedChip = await this.prismaClient.chip.update({
    where: { id: chip.id },
    data: {
      ownerDisplayName: updateChip.ownerDisplayName,
      ownerBio: updateChip.ownerBio,
      // If the ownerUserData is null (equal to the Json null value), set it to undefined, which just doesn't update the field
      // This is due to how Prisma handles Json null types
      // https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/working-with-json-fields#using-null-values
      ownerUserData:
        updateChip.ownerUserData === null
          ? undefined
          : updateChip.ownerUserData,
    },
  });

  // Return the updated chip
  return ChipSchema.parse(updatedChip);
};
