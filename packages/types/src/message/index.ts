import { z } from "zod";

export enum MessageType {
  TAP_BACK = "TAP_BACK",
  TAP_GRAPH_EDGE = "TAP_GRAPH_EDGE",
  PSI = "PSI"
}

export const MessageTypeSchema = z.nativeEnum(MessageType);

export const GetMessagesRequestSchema = z.object({
  authToken: z.string(),
  lastMessageFetchedAt: z.coerce.date().optional(),
});

export type GetMessagesRequest = z.infer<typeof GetMessagesRequestSchema>;

export const CreateMessageDataSchema = z.object({
  receiverSignaturePublicKey: z.string(),
  senderEphemeralEncryptionPublicKey: z.string(),
  encryptedData: z.string(),
  senderEncryptedSignaturePublicKey: z.string(),
  senderEncryptedSignature: z.string(),
});

export type CreateMessageData = z.infer<typeof CreateMessageDataSchema>;

export const CreateMessagesRequestSchema = z.object({
  authToken: z.string(),
  messages: z.array(CreateMessageDataSchema),
});

export type CreateMessagesRequest = z.infer<typeof CreateMessagesRequestSchema>;

export const MessageDataSchema = z.object({
  receiverSignaturePublicKey: z.string(),
  senderEphemeralEncryptionPublicKey: z.string(),
  encryptedData: z.string(),
  senderEncryptedSignaturePublicKey: z.string(),
  senderEncryptedSignature: z.string(),
  createdAt: z.coerce.date(),
});

export type MessageData = z.infer<typeof MessageDataSchema>;
