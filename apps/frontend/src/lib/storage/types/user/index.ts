import { z } from "zod";
import { UserDataSchema } from "./userData";
import { ChipSchema } from "./chip";
import { ConnectionSchema } from "./connection";
import { ActivitySchema } from "./activity";
import { EmailSchema } from "@types";

export const UserSchema = z.object({
  email: EmailSchema,
  signaturePrivateKey: z.string(),
  encryptionPrivateKey: z.string(),
  serializedPsiPrivateKey: z.string(),
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
