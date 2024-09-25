import { z } from "zod";

export const UserRegisterRequestSchema = z.object({
  email: z.string().email(),
  signaturePublicKey: z.string(),
  encryptionPublicKey: z.string(),
  passwordSalt: z.string(),
  passwordHash: z.string(),
});

export type UserRegisterRequest = z.infer<typeof UserRegisterRequestSchema>;

export const UserRegisterResponseSchema = z.object({
  registrationNumber: z.number().int(),
});

export type UserRegisterResponse = z.infer<typeof UserRegisterResponseSchema>;
