import { JsonSchema } from "../util";
import { z } from "zod";

export const ChipIssuerSchema = z.enum([
  "EDGE_CITY_LANNA",
  "DEVCON_2024",
  "TESTING",
]);

export type ChipIssuer = z.infer<typeof ChipIssuerSchema>;

export const ChipVariantSchema = z.enum(["NTAG212", "NTAG424"]);

export type ChipVariant = z.infer<typeof ChipVariantSchema>;

export const TapParamsSchema = z.record(z.string(), z.string());

export type TapParams = z.infer<typeof TapParamsSchema>;

export const RegisterChipRequestSchema = z.object({
  tapParams: TapParamsSchema,
  ownerDisplayName: z.string().nullable(),
  ownerBio: z.string().nullable(),
  ownerSignaturePublicKey: z.string().nullable(),
  ownerEncryptionPublicKey: z.string().nullable(),
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
});

export type RegisterChipResponse = z.infer<typeof RegisterChipResponseSchema>;

export const ChipTapSchema = z.object({
  chipPublicKey: z.string(),
  message: z.string(),
  signature: z.string(),
  tapCount: z.number().int().nonnegative(),
  timestamp: z.coerce.date(),
});

export type ChipTap = z.infer<typeof ChipTapSchema>;

export const ChipTapResponseSchema = z.object({
  chipIssuer: ChipIssuerSchema,
  chipIsRegistered: z.boolean(),
  tap: ChipTapSchema.nullable(),
});

export type ChipTapResponse = z.infer<typeof ChipTapResponseSchema>;
