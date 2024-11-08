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
import { ZodError } from "zod";
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
  tapParams: TapParams,
  registration: boolean
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
        console.error("error:", errorToString(error));
        throw error;
      }
    }
  } catch (error) {}

  // Try to parse the tapParams as an NTAG424
  try {
    const { encryptedChipId } = NTAG424TapParamsSchema.parse(tapParams);

    let data;
    let retries = 0;
    const maxRetries = 3;

    while (retries < maxRetries) {
      try {
        const response = await fetch(
          `http://ec2-13-215-189-29.ap-southeast-1.compute.amazonaws.com:9091/api/validate?e=${encryptedChipId}`,
          {
            method: "GET",
            headers: {
              Authorization:
                "Bearer 466b9db251785c2cc815a327ca4547e06222cc24af377cbb0729d543896ea599",
            },
          }
        );
        data = await response.json();
        break; // If successful, exit the loop
      } catch (error) {
        retries++;
        if (retries === maxRetries) {
          throw new Error(`Failed to fetch, please try tapping again.`);
        }
        // Wait for a short time before retrying
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    }

    const chipId = data.tag.uid.toString();
    if (data.valid) {
      if (data.tag.used && !registration) {
        throw new Error("Tap link already used, please try tapping again.");
      }
      const chip = await prisma.chip.findUnique({
        where: { chipId },
      });
      if (chip) {
        return ChipSchema.parse(chip);
      }
    }
  } catch (error) {
    // Only surface non-validation errors for N424 chips
    if (!(error instanceof ZodError)) {
      throw error;
    }
  }

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
  tapParams: TapParams,
  registration: boolean = false
): Promise<ChipTapResponse> => {
  let chip;
  try {
    chip = await getChipFromTapParams(prisma, tapParams, registration);
  } catch (error) {
    // We want to surface tap errors to user
    console.error("error:", errorToString(error));
    throw error;
  }

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
    ownerUsername,
    ownerDisplayName,
    ownerBio,
    ownerSignaturePublicKey,
    ownerEncryptionPublicKey,
    ownerPsiPublicKeyLink,
    ownerUserData,
    isLocationChip,
    locationId,
    locationName,
    locationDescription,
    locationData,
  } = chip;

  // If chip is not registered, return a response indicating so
  if (!chipIsRegistered || !chipPublicKey || !chipPrivateKey) {
    return ChipTapResponseSchema.parse({
      chipIssuer,
      chipIsRegistered,
      isLocationChip: null,
      userTap: null,
      locationTap: null,
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

  // Return the tap response based on chip type
  if (isLocationChip) {
    return ChipTapResponseSchema.parse({
      chipIssuer,
      chipIsRegistered,
      isLocationChip,
      userTap: null,
      locationTap: {
        chipPublicKey,
        message,
        signature,
        tapCount: chipTapCount + 1,
        locationId,
        locationName,
        locationDescription,
        locationData,
        timestamp: new Date(),
      },
    });
  }

  return ChipTapResponseSchema.parse({
    chipIssuer,
    chipIsRegistered,
    isLocationChip,
    userTap: {
      chipPublicKey,
      message,
      signature,
      tapCount: chipTapCount + 1,
      ownerUsername,
      ownerDisplayName,
      ownerBio,
      ownerSignaturePublicKey,
      ownerEncryptionPublicKey,
      ownerPsiPublicKeyLink,
      ownerUserData,
      timestamp: new Date(),
    },
    locationTap: null,
  });
};
