import {
  ChipTapResponse,
  ChipTapResponseSchema,
  errorToString,
  TapParams,
} from "@types";
import {
  Chip,
  ChipSchema,
  NTAG212TapParamsSchema,
  NTAG424TapParamsSchema,
} from "@/lib/controller/chip/types";
import { PrismaClient } from "@prisma/client";
import { getCounterMessage, sign } from "@/lib/util";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const crypto = require("crypto");

/**
 * Retrieves a Chip object from the provided TapParams.
 * Currently supports NTAG212 and NTAG424 chip types.
 *
 * @param prisma - PrismaClient instance for database operations
 * @param tapParams - Object containing tap parameters
 * @returns Promise resolving to a Chip object if found, or null if not found
 */
export async function getChipFromTapParams(
  prisma: PrismaClient,
  tapParams: TapParams
): Promise<Chip | null> {
  // Try to parse the tapParams as an NTAG212
  try {
    const validatedTapParams = NTAG212TapParamsSchema.parse(tapParams);

    const chip = await prisma.chip.findUnique({
      where: { chipId: validatedTapParams.chipId },
    });

    // If the chip exists, return it, otherwise continue parsing other schemas
    if (chip) {
      try {
        return ChipSchema.parse(chip);
      } catch (error) {
        console.log("error:", errorToString(error));
        throw error;
      }
    }
  } catch (error) {
    console.log("error:", error);
  }

  // Try to parse the tapParams as an NTAG424
  try {
    const validatedTapParams = NTAG424TapParamsSchema.parse(tapParams);

    // TODO: Decrypt the chipId and validate the cmac

    const chip = await prisma.chip.findUnique({
      where: { chipId: validatedTapParams.encryptedChipId },
    });

    if (chip) {
      return ChipSchema.parse(chip);
    }
  } catch (error) {}

  // All schemas failed, return null
  return null;
}

/**
 * Generates a tap signature for a given chip and returns a ChipTapResponse.
 * This function mirrors the Arx card signature generation process.
 *
 * The generated message consists of:
 * - First 4 bytes: An incrementing counter (msgNonce)
 * - Remaining 28 bytes: Random data
 *
 * @param prisma - PrismaClient instance for database operations
 * @param tapParams - Object containing tap parameters
 * @returns Promise resolving to a ChipTapResponse object
 * @throws Error if the chip is not found
 */
export const generateTapSignatureFromChip = async (
  prisma: PrismaClient,
  tapParams: TapParams
): Promise<ChipTapResponse> => {
  const chip = await getChipFromTapParams(prisma, tapParams);
  // If chip does not exist, throw an error
  if (!chip) {
    throw new Error("Chip not found");
  }

  const {
    id,
    chipIssuer,
    chipIsRegistered,
    chipPublicKey,
    chipPrivateKey,
    chipTapCount,
    ownerDisplayName,
    ownerBio,
    ownerSignaturePublicKey,
    ownerEncryptionPublicKey,
    ownerUserData,
  } = chip;

  // If chip is not registered, return a response indicating so
  if (!chipIsRegistered || !chipPublicKey || !chipPrivateKey) {
    return ChipTapResponseSchema.parse({
      chipIssuer,
      chipIsRegistered,
      tap: null,
    });
  }

  // Generate a tap signature
  const msgNonce = chipTapCount + 1; // Incrementing counter (4 bytes)
  const randomBytes = crypto.randomBytes(28); // 28 random bytes
  const message = getCounterMessage(msgNonce, randomBytes.toString("hex"));
  const signature = sign(chipPrivateKey, message);

  // Update chip tap count
  await prisma.chip.update({
    where: {
      id,
    },
    data: {
      chipTapCount: chipTapCount + 1,
    },
  });

  // Return the tap response
  return ChipTapResponseSchema.parse({
    chipIssuer,
    chipIsRegistered,
    tap: {
      chipPublicKey,
      message,
      signature,
      tapCount: chipTapCount + 1,
      ownerDisplayName,
      ownerBio,
      ownerSignaturePublicKey,
      ownerEncryptionPublicKey,
      ownerUserData,
      timestamp: new Date(),
    },
  });
};