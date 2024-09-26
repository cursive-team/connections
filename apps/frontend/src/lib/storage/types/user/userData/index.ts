import { z } from "zod";
import { TwitterDataSchema } from "./twitterData";
import { TelegramDataSchema } from "./telegramData";

export const UserDataSchema = z.object({
  displayName: z.string(),
  bio: z.string(),
  signaturePublicKey: z.string(),
  encryptionPublicKey: z.string(),
  twitter: TwitterDataSchema.optional(),
  telegram: TelegramDataSchema.optional(),
});

export type UserData = z.infer<typeof UserDataSchema>;

export { type TwitterData, TwitterDataSchema } from "./twitterData";
export { type TelegramData, TelegramDataSchema } from "./telegramData";
