import { z } from "zod";

export const AuthTokenSchema = z.object({
  value: z.string(),
  expiresAt: z.coerce.date(),
});

export type AuthToken = z.infer<typeof AuthTokenSchema>;

export const BackupEntryTypeSchema = z.enum(["INITIAL"]);

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

export const UserRegisterRequestSchema = z.object({
  email: z.string().email(),
  signaturePublicKey: z.string(),
  encryptionPublicKey: z.string(),
  passwordSalt: z.string(),
  passwordHash: z.string(),
  initialBackupData: CreateBackupDataSchema,
});

export type UserRegisterRequest = z.infer<typeof UserRegisterRequestSchema>;

export const UserRegisterResponseSchema = z.object({
  registrationNumber: z.number().int(),
  authToken: AuthTokenSchema,
  backupData: z.array(BackupDataSchema),
});

export type UserRegisterResponse = z.infer<typeof UserRegisterResponseSchema>;
