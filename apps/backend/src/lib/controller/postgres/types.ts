import { EmailSchema, UsernameSchema } from "@types";
import { z } from "zod";

// These values represent controller-level types, e.g. prisma types will be converted to these

export const UserSchema = z.object({
  id: z.string(),
  username: UsernameSchema,
  usernameLowercase: z.string(),
  email: EmailSchema,
  signaturePublicKey: z.string(),
  encryptionPublicKey: z.string(),
  psiPublicKeyLink: z.string(),
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
  psiPublicKeyLink: z.string(),
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

export type User = z.infer<typeof UserSchema>;
export type UserCreateRequest = z.infer<typeof UserCreateRequestSchema>;
export type Backup = z.infer<typeof BackupSchema>;
export type BackupCreateRequest = z.infer<typeof BackupCreateRequestSchema>;
export type SigninToken = z.infer<typeof SigninTokenSchema>;
export type AuthTokenCreateRequest = z.infer<
  typeof AuthTokenCreateRequestSchema
>;
