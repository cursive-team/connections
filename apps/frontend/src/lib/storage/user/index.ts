import { z } from "zod";

export const TwitterDataSchema = z.object({
  username: z.string().optional(),
});

export const TelegramDataSchema = z.object({
  username: z.string().optional(),
});

export const UserDataSchema = z.object({
  displayName: z.string(),
  bio: z.string(),
  signaturePublicKey: z.string(),
  encryptionPublicKey: z.string(),
  twitter: TwitterDataSchema.optional(),
  telegram: TelegramDataSchema.optional(),
});

export const ChipSchema = z.object({
  issuer: z.string(),
  id: z.string(),
  variant: z.string(),
  publicKey: z.string(),
  privateKey: z.string(),
});

export const CommentDataSchema = z.object({
  note: z.string().optional(),
  emoji: z.string().optional(),
  lastUpdatedAt: z.coerce.date().optional(),
});

export const TapDataSchema = z.object({
  message: z.string(),
  signature: z.string(),
  chipPublicKey: z.string(),
  chipIssuer: z.string(),
  timestamp: z.coerce.date(),
});

export const ConnectionSchema = z.object({
  user: UserDataSchema,
  comment: CommentDataSchema.optional(),
  taps: z.array(TapDataSchema),
});

export const ActivitySchema = z.object({
  type: z.string(),
  serializedData: z.string(),
  timestamp: z.coerce.date(),
});

export const UserSchema = z.object({
  email: z.string().email(),
  signaturePublicKey: z.string(),
  encryptionPublicKey: z.string(),
  lastMessageFetchedAt: z.coerce.date(),
  userData: UserDataSchema,
  chips: z.array(ChipSchema),
  connections: z.record(z.string(), ConnectionSchema),
  activities: z.array(ActivitySchema),
});

export type TwitterData = z.infer<typeof TwitterDataSchema>;
export type TelegramData = z.infer<typeof TelegramDataSchema>;
export type UserData = z.infer<typeof UserDataSchema>;
export type Chip = z.infer<typeof ChipSchema>;
export type CommentData = z.infer<typeof CommentDataSchema>;
export type TapData = z.infer<typeof TapDataSchema>;
export type Connection = z.infer<typeof ConnectionSchema>;
export type Activity = z.infer<typeof ActivitySchema>;
export type User = z.infer<typeof UserSchema>;

import { getFromLocalStorage, saveToLocalStorage } from "..";

const USER_STORAGE_KEY = "user";

export const saveUser = (user: User): void => {
  saveToLocalStorage(USER_STORAGE_KEY, JSON.stringify(user));
};

export const getUser = (): User | undefined => {
  const userString = getFromLocalStorage(USER_STORAGE_KEY);
  if (!userString) return undefined;

  try {
    const parsedUser = JSON.parse(userString);
    return UserSchema.parse(parsedUser);
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return undefined;
  }
};

export const deleteUser = (): void => {
  localStorage.removeItem(USER_STORAGE_KEY);
};
