import { z } from "zod";
import { nullToUndefined } from "@types";
import { TwitterDataSchema } from "./twitterData";
import { TelegramDataSchema } from "./telegramData";
import { LannaDataSchema, TensionsRatingSchema } from "./lannaData";

export const UserDataSchema = z.object({
  username: z.string(),
  displayName: z.string(),
  bio: z.string(),
  signaturePublicKey: z.string(),
  encryptionPublicKey: z.string(),
  psiPublicKeyLink: z.string(),
  twitter: nullToUndefined(TwitterDataSchema),
  telegram: nullToUndefined(TelegramDataSchema),
  lanna: nullToUndefined(LannaDataSchema),
  tensionsRating: nullToUndefined(TensionsRatingSchema),
  attendance: z.array(z.string()).default([]),
});

export type UserData = z.infer<typeof UserDataSchema>;

export { type TwitterData, TwitterDataSchema } from "./twitterData";
export { type TelegramData, TelegramDataSchema } from "./telegramData";
export {
  type LannaDesiredConnections,
  LannaDesiredConnectionsSchema,
  type LannaData,
  LannaDataSchema,
} from "./lannaData";
