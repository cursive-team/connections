import { JsonSchema } from "../util";
import { z } from "zod";

export enum ChipIssuer {
  USER = "USER",
  EDGE_CITY_LANNA = "EDGE_CITY_LANNA",
  DEVCON_2024 = "DEVCON_2024",
  ETH_INDIA_2024 = "ETH_INDIA_2024",
  TESTING = "TESTING",
}

export const ChipIssuerSchema = z.nativeEnum(ChipIssuer);

export enum ChipVariant {
  NTAG212 = "NTAG212",
  NTAG424 = "NTAG424",
}

export const ChipVariantSchema = z.nativeEnum(ChipVariant);

export const ChipPublicKeySignatureSchema = z.object({
  R8xHex: z.string(),
  R8yHex: z.string(),
  SHex: z.string(),
});

export type ChipPublicKeySignature = z.infer<
  typeof ChipPublicKeySignatureSchema
>;

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
  chipIssuer: ChipIssuerSchema,
  chipId: z.string(),
  ownerDisplayName: z.string().nullable(),
  ownerBio: z.string().nullable(),
  ownerUserData: JsonSchema.nullable(),
});

export type UpdateChipRequest = z.infer<typeof UpdateChipRequestSchema>;

export const GetChipIdRequestParamsSchema = z.object({
  authToken: z.string(),
  username: z.string(),
  chipIssuer: ChipIssuerSchema,
});

export type GetChipIdRequestParams = z.infer<
  typeof GetChipIdRequestParamsSchema
>;

export const GetChipIdResponseSchema = z.object({
  id: z.string(),
});

export type GetChipIdResponse = z.infer<typeof GetChipIdResponseSchema>;

export const UserTapSchema = z.object({
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
  chipPublicKeySignature: z.string().nullable(),
});

export type UserTap = z.infer<typeof UserTapSchema>;

export const LocationTapSchema = z.object({
  chipPublicKey: z.string(),
  message: z.string(),
  signature: z.string(),
  tapCount: z.number().int().nonnegative(),
  locationId: z.string().nullable(),
  locationName: z.string().nullable(),
  locationDescription: z.string().nullable(),
  locationData: JsonSchema.nullable(),
  timestamp: z.coerce.date(),
});

export type LocationTap = z.infer<typeof LocationTapSchema>;

export const ChipTapResponseSchema = z.object({
  chipIssuer: ChipIssuerSchema,
  chipIsRegistered: z.boolean(),
  isLocationChip: z.boolean().nullable(),
  userTap: UserTapSchema.nullable(),
  locationTap: LocationTapSchema.nullable(),
});

export type ChipTapResponse = z.infer<typeof ChipTapResponseSchema>;

export enum LeaderboardEntryType {
  TOTAL_TAP_COUNT = "TOTAL_TAP_COUNT",
  WEEK_OCT_20_TAP_COUNT = "WEEK_OCT_20_TAP_COUNT",
  WEEK_OCT_27_TAP_COUNT = "WEEK_OCT_27_TAP_COUNT",
  WEEK_NOV_4_TAP_COUNT = "WEEK_NOV_4_TAP_COUNT",
  STRAVA_PREVIOUS_MONTH_RUN_DISTANCE = "STRAVA_PREVIOUS_MONTH_RUN_DISTANCE",
  GITHUB_WEEK_OCT_20_COMMITS = "GITHUB_WEEK_OCT_20_COMMITS",
  GITHUB_LANNA_COMMITS = "GITHUB_LANNA_COMMITS",
  GITHUB_CONTRIBUTIONS_LAST_YEAR = "GITHUB_CONTRIBUTIONS_LAST_YEAR",
  LANNA_TOTAL_WORKOUT_COUNT = "LANNA_TOTAL_WORKOUT_COUNT",
  DEVCON_2024_TAP_COUNT = "DEVCON_2024_TAP_COUNT",
  DEVCON_2024_DAY_1_TAP_COUNT = "DEVCON_2024_DAY_1_TAP_COUNT",
  DEVCON_2024_DAY_2_TAP_COUNT = "DEVCON_2024_DAY_2_TAP_COUNT",
  DEVCON_2024_DAY_3_TAP_COUNT = "DEVCON_2024_DAY_3_TAP_COUNT",
  DEVCON_2024_DAY_4_TAP_COUNT = "DEVCON_2024_DAY_4_TAP_COUNT",
  DEVCON_2024_TAP_COUNT_NO_PROOF = "DEVCON_2024_TAP_COUNT_NO_PROOF",
  ETHINDIA_2024_TAP_COUNT = "ETHINDIA_2024_TAP_COUNT",
  USER_REGISTRATION_ONBOARDING = "USER_REGISTRATION_ONBOARDING", // NOTE: This leaderboard type *increments* the EntryValue. The default updates the value to whats passed in.
}

export const LeaderboardEntryTypeSchema = z.nativeEnum(LeaderboardEntryType);

export const UpdateLeaderboardEntryRequestSchema = z.object({
  authToken: z.string(),
  chipIssuer: ChipIssuerSchema,
  entryType: LeaderboardEntryTypeSchema,
  entryValue: z.number(),
  entryUsername: z.string().optional(),
});

export type UpdateLeaderboardEntryRequest = z.infer<
  typeof UpdateLeaderboardEntryRequestSchema
>;

export const GetLeaderboardEntryRequestSchema = z.object({
  authToken: z.string(),
  count: z.number().optional(),
  chipIssuer: ChipIssuerSchema,
  entryType: LeaderboardEntryTypeSchema,
});

export type GetLeaderboardEntryRequest = z.infer<
  typeof GetLeaderboardEntryRequestSchema
>;

export const LeaderboardEntrySchema = z.object({
  username: z.string(),
  entryValue: z.coerce.number(),
});

export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>;

export const GetLeaderboardPositionRequestSchema = z.object({
  authToken: z.string(),
  chipIssuer: ChipIssuerSchema,
  entryType: LeaderboardEntryTypeSchema,
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
  userValue: z.number(),
  totalContributors: z.coerce.number(),
  totalValue: z.coerce.number(),
});

export type LeaderboardDetails = z.infer<typeof LeaderboardDetailsSchema>;

export const SubmitProofJobRequestSchema = z.object({
  authToken: z.string(),
  jobId: z.string(),
});

export type SubmitProofJobRequest = z.infer<typeof SubmitProofJobRequestSchema>;
