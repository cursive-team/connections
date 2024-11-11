import { z } from "zod";

export const SentMessageSchema = z.object({
  serializedData: z.string(),
  timestamp: z.coerce.date(),
});

export type SentMessage = z.infer<typeof SentMessageSchema>;
