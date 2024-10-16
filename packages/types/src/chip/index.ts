import { JsonSchema } from "../util";
import { z } from "zod";

export enum ChipIssuer {
  EDGE_CITY_LANNA = "EDGE_CITY_LANNA",
  DEVCON_2024 = "DEVCON_2024",
  TESTING = "TESTING",
}

export const ChipIssuerSchema = z.nativeEnum(ChipIssuer);

export enum ChipVariant {
  NTAG212 = "NTAG212",
  NTAG424 = "NTAG424",
}

export const ChipVariantSchema = z.nativeEnum(ChipVariant);

export const TapParamsSchema = z.record(z.string(), z.string());

export type TapParams = z.infer<typeof TapParamsSchema>;

export const RegisterChipRequestSchema = z.object({
  authToken: z.string(),
  tapParams: TapParamsSchema,
  ownerUsername: z.string().nullable(),
  ownerDisplayName: z.string().nullable(),
  ownerBio: z.string().nullable(),
  ownerSignaturePublicKey: z.string().nullable(),
  ownerEncryptionPublicKey: z.string().nullable(),
  ownerPsiPublicKeyLink: z.string().nullable(),
  ownerUserData: JsonSchema.nullable(),
});

export type RegisterChipRequest = z.infer<typeof RegisterChipRequestSchema>;

export const RegisterChipResponseSchema = z.object({
  chipIssuer: ChipIssuerSchema.transform((val) => {
    if (ChipIssuerSchema.safeParse(val).success) {
      return val;
    }
    throw new Error("Invalid chip issuer");
  }),
  chipId: z.string(),
  chipVariant: ChipVariantSchema.transform((val) => {
    if (ChipVariantSchema.safeParse(val).success) {
      return val;
    }
    throw new Error("Invalid chip variant");
  }),
  chipPublicKey: z.string(),
  chipPrivateKey: z.string(),
  chipRegisteredAt: z.coerce.date(),
});

export type RegisterChipResponse = z.infer<typeof RegisterChipResponseSchema>;

export const UpdateChipRequestSchema = z.object({
  authToken: z.string(),
  tapParams: TapParamsSchema,
  ownerDisplayName: z.string().nullable(),
  ownerBio: z.string().nullable(),
  ownerUserData: JsonSchema.nullable(),
});

export type UpdateChipRequest = z.infer<typeof UpdateChipRequestSchema>;

export const ChipTapSchema = z.object({
  chipPublicKey: z.string(),
  message: z.string(),
  signature: z.string(),
  tapCount: z.number().int().nonnegative(),
  ownerUsername: z.string().nullable(),
  ownerDisplayName: z.string().nullable(),
  ownerBio: z.string().nullable(),
  ownerSignaturePublicKey: z.string().nullable(),
  ownerEncryptionPublicKey: z.string().nullable(),
  ownerPsiPublicKeyLink: z.string().nullable(),
  ownerUserData: JsonSchema.nullable(),
  timestamp: z.coerce.date(),
});

export type ChipTap = z.infer<typeof ChipTapSchema>;

export const ChipTapResponseSchema = z.object({
  chipIssuer: ChipIssuerSchema,
  chipIsRegistered: z.boolean(),
  tap: ChipTapSchema.nullable(),
});

export type ChipTapResponse = z.infer<typeof ChipTapResponseSchema>;
