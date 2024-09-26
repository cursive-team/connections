import { z } from "zod";
import { UserDataSchema } from "./userData";
import { ChipSchema } from "./chip";
import { ConnectionSchema } from "./connection";
import { ActivitySchema } from "./activity";

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

export type User = z.infer<typeof UserSchema>;

export * from "./userData";
export * from "./chip";
export * from "./connection";
export * from "./activity";
