import { z } from "zod";
import { UserDataSchema } from "./userData";
import { ChipSchema } from "./chip";
import { ConnectionSchema } from "./connection";
import { ActivitySchema } from "./activity";
import { AccessTokenSchema, EmailSchema, nullToUndefined } from "@types";
import { LocationSchema } from "./location";

export const UserSchema = z.object({
  email: EmailSchema,
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
});

export type User = z.infer<typeof UserSchema>;

export * from "./userData";
export * from "./chip";
export * from "./connection";
export * from "./activity";
export * from "./oauth";
export * from "./location";
