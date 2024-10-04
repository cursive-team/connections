import { z } from "zod";

export const MessageLogSchema = z.object({
  senderEphemeralEncryptionPublicKey: z.string(),
  senderEphemeralEncryptionPrivateKey: z.string(),
  receiverEncryptionPublicKey: z.string(),
  timestamp: z.coerce.date(),
});

export type MessageLog = z.infer<typeof MessageLogSchema>;
