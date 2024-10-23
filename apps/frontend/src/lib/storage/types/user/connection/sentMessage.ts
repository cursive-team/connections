import { z } from "zod";

export enum MessageType {
  TAP_BACK = "TAP_BACK",
}

export const MessageTypeSchema = z.nativeEnum(MessageType);

export const SentMessageSchema = z.object({
  serializedData: z.string(),
  timestamp: z.coerce.date(),
});

export type SentMessage = z.infer<typeof SentMessageSchema>;
