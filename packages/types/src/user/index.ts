import { ChipIssuerSchema } from "../chip";
import { z } from "zod";

// Username schema
export const UsernameSchema = z.string().regex(/^[a-zA-Z0-9]{3,20}$/);

// Email schema
export const EmailSchema = z.string().email();

// Enum for backup entry types
export enum BackupEntryType {
  INITIAL = "INITIAL",
  USER_DATA = "USER_DATA",
  CHIP = "CHIP",
  CONNECTION = "CONNECTION",
  ACTIVITY = "ACTIVITY",
}

export const BackupEntryTypeSchema = z.nativeEnum(BackupEntryType);

// Generic backup data schema for creating a backup
export const CreateBackupDataSchema = z.object({
  authenticationTag: z.string(),
  iv: z.string(),
  encryptedData: z.string(),
  backupEntryType: z.coerce.string().transform((val) => {
    if (BackupEntryTypeSchema.safeParse(val).success) {
      return val;
    }
    throw new Error("Invalid backup entry type");
  }),
  clientCreatedAt: z.coerce.date(),
});

export type CreateBackupData = z.infer<typeof CreateBackupDataSchema>;

// Backup data schema for fetched backup data entries
export const BackupDataSchema = z.object({
  authenticationTag: z.string(),
  iv: z.string(),
  encryptedData: z.string(),
  backupEntryType: z.coerce.string().transform((val) => {
    if (BackupEntryTypeSchema.safeParse(val).success) {
      return val;
    }
    throw new Error("Invalid backup entry type");
  }),
  clientCreatedAt: z.coerce.date(),
  submittedAt: z.coerce.date(),
});

export type BackupData = z.infer<typeof BackupDataSchema>;

// Request schema for appending backup data
export const AppendBackupDataRequestSchema = z.object({
  authToken: z.string(),
  newBackupData: z.array(CreateBackupDataSchema),
  previousSubmittedAt: z.coerce.date(),
});

export type AppendBackupDataRequest = z.infer<
  typeof AppendBackupDataRequestSchema
>;

// Response schema for appending backup data
export const AppendBackupDataResponseSchema = z.object({
  success: z.boolean(),
  unprocessedBackupData: z.array(BackupDataSchema),
  newBackupData: z.array(BackupDataSchema),
});

export type AppendBackupDataResponse = z.infer<
  typeof AppendBackupDataResponseSchema
>;

// Auth token schema
export const AuthTokenSchema = z.object({
  value: z.string(),
  expiresAt: z.coerce.date(),
});

export type AuthToken = z.infer<typeof AuthTokenSchema>;

// Signin token schema
export const SigninTokenSchema = z.string().length(6).regex(/^\d+$/);

export type SigninToken = z.infer<typeof SigninTokenSchema>;

// Request schema for verifying username uniqueness
export const VerifyUsernameUniqueRequestSchema = z.object({
  username: UsernameSchema,
});

export type VerifyUsernameUniqueRequest = z.infer<
  typeof VerifyUsernameUniqueRequestSchema
>;

export const VerifyUsernameUniqueResponseSchema = z.object({
  isUnique: z.boolean(),
});

export type VerifyUsernameUniqueResponse = z.infer<
  typeof VerifyUsernameUniqueResponseSchema
>;

// Request schema for verifying email uniqueness
export const VerifyEmailUniqueRequestSchema = z.object({
  email: EmailSchema,
});

export type VerifyEmailUniqueRequest = z.infer<
  typeof VerifyEmailUniqueRequestSchema
>;

export const VerifyEmailUniqueResponseSchema = z.object({
  isUnique: z.boolean(),
});

export type VerifyEmailUniqueResponse = z.infer<
  typeof VerifyEmailUniqueResponseSchema
>;

// Request schema for registering a user
export const UserRegisterRequestSchema = z.object({
  signinToken: SigninTokenSchema,
  username: UsernameSchema,
  email: EmailSchema,
  signaturePublicKey: z.string(),
  encryptionPublicKey: z.string(),
  psiPublicKeyLink: z.string(),
  passwordSalt: z.string(),
  passwordHash: z.string(),
  registeredWithPasskey: z.boolean(),
  passkeyAuthPublicKey: z.string().optional(),
  initialBackupData: CreateBackupDataSchema,
});

export type UserRegisterRequest = z.infer<typeof UserRegisterRequestSchema>;

// Response schema for registering a user
export const UserRegisterResponseSchema = z.object({
  authToken: AuthTokenSchema,
  backupData: z.array(BackupDataSchema),
  registrationNumber: z.number().int(),
});

export type UserRegisterResponse = z.infer<typeof UserRegisterResponseSchema>;

// Request schema for logging in a user
export const UserLoginRequestSchema = z.object({
  email: EmailSchema,
  signinToken: SigninTokenSchema,
});

export type UserLoginRequest = z.infer<typeof UserLoginRequestSchema>;

// Response schema for logging in a user
export const UserLoginResponseSchema = z.object({
  authToken: AuthTokenSchema,
  backupData: z.array(BackupDataSchema),
  passwordSalt: z.string(),
  passwordHash: z.string(),
  registeredWithPasskey: z.boolean(),
  passkeyAuthPublicKey: z.string().optional(),
});

export type UserLoginResponse = z.infer<typeof UserLoginResponseSchema>;

// Request schema for creating a signin token
export const CreateSigninTokenRequestSchema = z.object({
  email: EmailSchema,
});

export type CreateSigninTokenRequest = z.infer<
  typeof CreateSigninTokenRequestSchema
>;

// Request schema for verifying a signin token
export const VerifySigninTokenRequestSchema = z.object({
  email: EmailSchema,
  signinToken: SigninTokenSchema,
});

export type VerifySigninTokenRequest = z.infer<
  typeof VerifySigninTokenRequestSchema
>;

export const VerifySigninTokenResponseSchema = z.object({
  success: z.boolean(),
});

export type VerifySigninTokenResponse = z.infer<
  typeof VerifySigninTokenResponseSchema
>;

export const UpdateLeaderboardEntryRequestSchema = z.object({
  authToken: z.string(),
  chipIssuer: ChipIssuerSchema,
});

export type UpdateLeaderboardEntryRequest = z.infer<
  typeof UpdateLeaderboardEntryRequestSchema
>;
