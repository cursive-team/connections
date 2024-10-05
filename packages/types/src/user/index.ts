import { z } from "zod";

// Auth token schema
export const AuthTokenSchema = z.object({
  value: z.string(),
  expiresAt: z.coerce.date(),
});

export type AuthToken = z.infer<typeof AuthTokenSchema>;

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

// Request schema for creating a signin token
export const CreateSigninTokenRequestSchema = z.object({
  email: z.string().email(),
});

export type CreateSigninTokenRequest = z.infer<
  typeof CreateSigninTokenRequestSchema
>;

// Request schema for verifying a signin token
export const VerifySigninTokenRequestSchema = z.object({
  email: z.string().email(),
  signinToken: z.string().length(6).regex(/^\d+$/),
});

export type VerifySigninTokenRequest = z.infer<
  typeof VerifySigninTokenRequestSchema
>;

// Username schema
export const UsernameSchema = z.string().regex(/^[a-zA-Z0-9]{3,20}$/);

// Request schema for verifying username uniqueness
export const VerifyUsernameUniqueRequestSchema = z.object({
  username: UsernameSchema,
});

export type VerifyUsernameUniqueRequest = z.infer<
  typeof VerifyUsernameUniqueRequestSchema
>;

// Request schema for registering a user
export const UserRegisterRequestSchema = z.object({
  username: UsernameSchema,
  email: z.string().email(),
  signaturePublicKey: z.string(),
  encryptionPublicKey: z.string(),
  psiPublicKeyLink: z.string(),
  passwordSalt: z.string(),
  passwordHash: z.string(),
  registeredWithPasskey: z.boolean(),
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
  email: z.string().email(),
});

export type UserLoginRequest = z.infer<typeof UserLoginRequestSchema>;

// Response schema for logging in a user
export const UserLoginResponseSchema = z.object({
  authToken: AuthTokenSchema,
  backupData: z.array(BackupDataSchema),
  passwordSalt: z.string(),
  passwordHash: z.string(),
});

export type UserLoginResponse = z.infer<typeof UserLoginResponseSchema>;
