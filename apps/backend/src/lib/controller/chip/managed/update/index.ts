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

  // ensure user owns the chip
  const prismaAuthToken = await this.prismaClient.authToken.findUnique({
    where: { value: updateChip.authToken },
  });
  if (!prismaAuthToken) {
    throw new Error("Invalid auth token");
  }

  const authUser = await this.prismaClient.user.findUnique({
    where: { id: prismaAuthToken.userId },
  });
  if (!authUser) {
    throw new Error("User not found");
  }
  if (authUser.username !== chip.ownerUsername) {
    throw new Error("User does not own this chip");
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

  // send notification to user
  await this.notificationClient.SendNotification(
    authUser.id,
    "Your chip has been updated!"
  );

  // Return the updated chip
  return ChipSchema.parse(updatedChip);
};
