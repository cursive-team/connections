import { z } from "zod";
<<<<<<< HEAD
import { ChipIssuerSchema, ChipVariantSchema, JsonSchema } from "@types";
=======
import { ChipIssuerSchema, ChipVariantSchema } from "@types";
>>>>>>> 0d1ba92 (backend implementation of chip registration and tapping)

export const ChipSchema = z.object({
  id: z.string(),
  chipIssuer: ChipIssuerSchema,
  chipId: z.string(),
  chipVariant: ChipVariantSchema,
  chipIsRegistered: z.boolean(),
<<<<<<< HEAD
  chipPublicKey: z.string().nullable(),
  chipPrivateKey: z.string().nullable(),
  chipTapCount: z.number().int().nonnegative(),
  ownerDisplayName: z.string().nullable(),
  ownerBio: z.string().nullable(),
  ownerSignaturePublicKey: z.string().nullable(),
  ownerEncryptionPublicKey: z.string().nullable(),
  ownerUserData: JsonSchema.nullable(),
=======
  chipPublicKey: z.string(),
  chipPrivateKey: z.string(),
  chipTapCount: z.number().int().nonnegative(),
  ownerDisplayName: z.string().optional(),
  ownerBio: z.string().optional(),
  ownerSignaturePublicKey: z.string().optional(),
  ownerEncryptionPublicKey: z.string().optional(),
  ownerUserData: z.record(z.unknown()).optional(),
>>>>>>> 0d1ba92 (backend implementation of chip registration and tapping)
  createdAt: z.date(),
});

export type Chip = z.infer<typeof ChipSchema>;

// RegisterChipRequest is a shared type

// TapParams is a shared type

// ChipTapResponse is a shared type
<<<<<<< HEAD

export const NTAG212TapParamsSchema = z.object({
  chipId: z.string(),
});

export const NTAG424TapParamsSchema = z.object({
  encryptedChipId: z.string(),
  cmac: z.string(),
});
=======
>>>>>>> 0d1ba92 (backend implementation of chip registration and tapping)
