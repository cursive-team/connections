import { ChipIssuerSchema, EmailSchema, UsernameSchema } from "@types";
import { z } from "zod";

// These values represent controller-level types, e.g. prisma types will be converted to these

export const UserSchema = z.object({
  id: z.string(),
  username: UsernameSchema,
  usernameLowercase: z.string(),
  email: EmailSchema,
  signaturePublicKey: z.string(),
  encryptionPublicKey: z.string(),
  psiPublicKeyLink: z.string().nullable(),
  passwordSalt: z.string(),
  passwordHash: z.string(),
  registrationNumber: z.number(),
  registeredWithPasskey: z.boolean(),
  passkeyAuthPublicKey: z.string().nullable(),
  createdAt: z.date(),
});

export const UserCreateRequestSchema = z.object({
  username: UsernameSchema,
  email: EmailSchema,
  signaturePublicKey: z.string(),
  encryptionPublicKey: z.string(),
  psiPublicKeyLink: z.string().optional(),
  passwordSalt: z.string(),
  passwordHash: z.string(),
  registeredWithPasskey: z.boolean(),
  passkeyAuthPublicKey: z.string().optional(),
});

export const BackupSchema = z.object({
  id: z.string(),
  userId: z.string(),
  authenticationTag: z.string(),
  iv: z.string(),
  encryptedData: z.string(),
  backupEntryType: z.string(),
  clientCreatedAt: z.date(),
  submittedAt: z.date(),
});

export const BackupCreateRequestSchema = z.object({
  user: z.object({
    connect: z.object({
      id: z.string(),
    }),
  }),
  authenticationTag: z.string(),
  iv: z.string(),
  encryptedData: z.string(),
  backupEntryType: z.string(),
  clientCreatedAt: z.date(),
});

export const SigninTokenSchema = z.object({
  id: z.string(),
  email: z.string(),
  value: z.string(),
  isUsed: z.boolean(),
  expiresAt: z.date(),
  createdAt: z.date(),
});

export const AuthTokenCreateRequestSchema = z.object({
  value: z.string(),
  userId: z.string(),
  expiresAt: z.date(),
});

// AuthToken is a shared type

export const DataHashSchema = z.object({
  id: z.string(),
  username: UsernameSchema,
  chipIssuer: ChipIssuerSchema.nullable(),
  locationId: z.string().nullable(),
  dataIdentifier: z.string(),
  encryptedInput: z.string(),
  enclavePublicKey: z.string(),
  dataHash: z.string().nullable(),
  secretHash: z.string().nullable(),
  createdAt: z.date(),
});

export const CreateDataHashSchema = z.object({
  username: UsernameSchema,
  chipIssuer: ChipIssuerSchema.nullable(),
  locationId: z.string().nullable(),
  dataIdentifier: z.string(),
  encryptedInput: z.string().nullable(),
  enclavePublicKey: z.string(),
});

export const UpdateDataHashSchema = z.object({
  id: z.string(),
  dataHash: z.string(),
  secretHash: z.string(),
});

export const DataHashMatchSchema = z.object({
  usernameA: UsernameSchema,
  displayNameA: z.string().nullable(),
  notificationUsernameA: z.string().nullable(),
  usernameB: UsernameSchema,
  displayNameB: z.string().nullable(),
  notificationUsernameB: z.string().nullable(),
  connectionScore: z.number(),
  createdAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;
export type UserCreateRequest = z.infer<typeof UserCreateRequestSchema>;
export type Backup = z.infer<typeof BackupSchema>;
export type BackupCreateRequest = z.infer<typeof BackupCreateRequestSchema>;
export type SigninToken = z.infer<typeof SigninTokenSchema>;
export type AuthTokenCreateRequest = z.infer<
  typeof AuthTokenCreateRequestSchema
>;
export type DataHash = z.infer<typeof DataHashSchema>;
export type CreateDataHash = z.infer<typeof CreateDataHashSchema>;
export type UpdateDataHash = z.infer<typeof UpdateDataHashSchema>;
export type DataHashMatch = z.infer<typeof DataHashMatchSchema>;
