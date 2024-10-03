import { RegisterChipRequest } from "@types";
import { Chip, ChipSchema } from "../../types";
import { ManagedChipClient } from "../client";
import { getChipFromTapParams } from "../util";
import { generateSignatureKeyPair } from "@/lib/util";

ManagedChipClient.prototype.RegisterChip = async function (
  registerChip: RegisterChipRequest
): Promise<Chip> {
  const chip = await getChipFromTapParams(
    this.prismaClient,
    registerChip.tapParams
  );

  if (!chip) {
    throw new Error("Chip not found");
  }

  // Generate a new public/private key pair
  const { signingKey, verifyingKey } = generateSignatureKeyPair();

  // Update the chip with registration information
  const updatedChip = await this.prismaClient.chip.update({
    where: { id: chip.id },
    data: {
      chipIsRegistered: true,
      chipRegisteredAt: new Date(),
      chipPublicKey: verifyingKey,
      chipPrivateKey: signingKey,
      chipTapCount: 0, // Reset tap count on registration
      ownerDisplayName: registerChip.ownerDisplayName,
      ownerBio: registerChip.ownerBio,
      ownerSignaturePublicKey: registerChip.ownerSignaturePublicKey,
      ownerEncryptionPublicKey: registerChip.ownerEncryptionPublicKey,
      // If the ownerUserData is null (equal to the Json null value), set it to undefined, which just doesn't update the field
      // This is due to how Prisma handles Json null types
      // https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/working-with-json-fields#using-null-values
      ownerUserData:
        registerChip.ownerUserData === null
          ? undefined
          : registerChip.ownerUserData,
    },
  });

  // Return the updated chip
  return ChipSchema.parse(updatedChip);
};
