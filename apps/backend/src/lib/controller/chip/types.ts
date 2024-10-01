import { z } from "zod";
import { ChipIssuerSchema, ChipVariantSchema, JsonSchema } from "@types";

export const ChipSchema = z.object({
  id: z.string(),
  chipIssuer: ChipIssuerSchema,
  chipId: z.string(),
  chipVariant: ChipVariantSchema,
  chipIsRegistered: z.boolean(),
  chipPublicKey: z.string().nullable(),
  chipPrivateKey: z.string().nullable(),
  chipTapCount: z.number().int().nonnegative(),
  ownerDisplayName: z.string().nullable(),
  ownerBio: z.string().nullable(),
  ownerSignaturePublicKey: z.string().nullable(),
  ownerEncryptionPublicKey: z.string().nullable(),
  ownerUserData: JsonSchema.nullable(),
  createdAt: z.date(),
});

export type Chip = z.infer<typeof ChipSchema>;

// RegisterChipRequest is a shared type

// TapParams is a shared type

// ChipTapResponse is a shared type

export const NTAG212TapParamsSchema = z.object({
  chipId: z.string(),
});

export const NTAG424TapParamsSchema = z.object({
  encryptedChipId: z.string(),
  cmac: z.string(),
});