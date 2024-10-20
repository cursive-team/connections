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

export const UpdateLeaderboardEntryRequestSchema = z.object({
  authToken: z.string(),
  chipIssuer: ChipIssuerSchema,
});

export type UpdateLeaderboardEntryRequest = z.infer<
  typeof UpdateLeaderboardEntryRequestSchema
>;

export const GetLeaderboardEntryRequestSchema = z.object({
  authToken: z.string(),
  count: z.number().optional(),
  chipIssuer: ChipIssuerSchema,
});

export type GetLeaderboardEntryRequest = z.infer<
  typeof GetLeaderboardEntryRequestSchema
>;

export const LeaderboardEntrySchema = z.object({
  username: z.string(),
  chipIssuer: z.string(),
  tapCount: z.number(),
  // In the future could imagine name, chip fields being added to allow custom leaderboards corresponding to specific chips
});

export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>;

export const GetLeaderboardPositionRequestSchema = z.object({
  authToken: z.string(),
  chipIssuer: ChipIssuerSchema,
});

export type GetLeaderboardPositionRequest = z.infer<
  typeof GetLeaderboardPositionRequestSchema
>;

export const LeaderboardEntriesSchema = z.object({
  entries: z.array(LeaderboardEntrySchema),
});

export type LeaderboardEntries = z.infer<typeof LeaderboardEntriesSchema>;

export const LeaderboardDetailsSchema = z.object({
  username: z.string(),
  userPosition: z.coerce.number(),
  totalContributors: z.coerce.number(),
  totalTaps: z.coerce.number(),
});

export type LeaderboardDetails = z.infer<typeof LeaderboardDetailsSchema>;
