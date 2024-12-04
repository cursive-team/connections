import { z } from "zod";
import { UnregisteredUserDataSchema, UserDataSchema } from "./userData";
import { ChipSchema } from "./chip";
import { ConnectionSchema } from "./connection";
import { ActivitySchema } from "./activity";
import {
  AccessTokenSchema,
  nullToUndefined,
  UnregisteredUserBackupSchema
} from "@types";
import { LocationSchema } from "./location";
import { EdgeBackupSchema } from "./edge";

export const UserSchema = z.object({
  email: z.string(), // Email here is actually used as a backup salt for backwards compatibility reasons.
  signaturePrivateKey: z.string(),
  encryptionPrivateKey: z.string(),
  serializedPsiPrivateKey: nullToUndefined(z.string()),
  lastMessageFetchedAt: z.coerce.date(),
  userData: UserDataSchema,
  chips: z.array(ChipSchema),
  connections: z.record(z.string(), ConnectionSchema),
  locations: nullToUndefined(z.record(z.string(), LocationSchema)),
  activities: z.array(ActivitySchema),
  oauth: nullToUndefined(z.record(z.string(), AccessTokenSchema)),

  // Tap graph attributes -- NOTE: tapGraphEnabled should be moved to UserSettings at some point
  tapGraphEnabled: nullToUndefined(z.boolean().nullable()),
  edgesBackfilledForUsersWithEnabledFeature: nullToUndefined(z.boolean().nullable()),
  edges: nullToUndefined(z.array(EdgeBackupSchema)),
});

export type User = z.infer<typeof UserSchema>;

export const UnregisteredUserSchema = z.object({
  signaturePrivateKey: z.string(),
  encryptionPrivateKey: z.string(),
  lastMessageFetchedAt: z.coerce.date(),
  userData: UnregisteredUserDataSchema,
  connections: z.record(z.string(), ConnectionSchema),
  locations: nullToUndefined(z.record(z.string(), LocationSchema)),
  activities: z.array(ActivitySchema),

  // Unique field for unregistered user
  backups: z.array(UnregisteredUserBackupSchema),
});

export type UnregisteredUser = z.infer<typeof UnregisteredUserSchema>;

export * from "./userData";
export * from "./chip";
export * from "./connection";
export * from "./activity";
export * from "./oauth";
export * from "./location";
export * from "./edge";
