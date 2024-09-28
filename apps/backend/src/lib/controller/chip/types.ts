import { z } from "zod";
import { ChipIssuerSchema, ChipVariantSchema } from "@types";

export const ChipSchema = z.object({
  id: z.string(),
  chipIssuer: ChipIssuerSchema,
  chipId: z.string(),
  chipVariant: ChipVariantSchema,
  chipIsRegistered: z.boolean(),
  chipPublicKey: z.string(),
  chipPrivateKey: z.string(),
  chipTapCount: z.number().int().nonnegative(),
  ownerDisplayName: z.string().optional(),
  ownerBio: z.string().optional(),
  ownerSignaturePublicKey: z.string().optional(),
  ownerEncryptionPublicKey: z.string().optional(),
  ownerUserData: z.record(z.unknown()).optional(),
  createdAt: z.date(),
});

export type Chip = z.infer<typeof ChipSchema>;

// RegisterChipRequest is a shared type

// TapParams is a shared type

// ChipTapResponse is a shared type
