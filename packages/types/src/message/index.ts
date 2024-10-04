import { z } from "zod";

export const CreateMessageDataSchema = z.object({
  receiverSignaturePublicKey: z.string(),
  senderEphemeralEncryptionPublicKey: z.string(),
  encryptedData: z.string(),
  senderEncryptedSignaturePublicKey: z.string(),
  senderEncryptedSignature: z.string(),
});

export type CreateMessageData = z.infer<typeof CreateMessageDataSchema>;

export const CreateMessageRequestSchema = z.object({
  authToken: z.string(),
  messages: z.array(CreateMessageDataSchema),
});

export type CreateMessageRequest = z.infer<typeof CreateMessageRequestSchema>;

export const MessageDataSchema = z.object({
  receiverSignaturePublicKey: z.string(),
  senderEphemeralEncryptionPublicKey: z.string(),
  encryptedData: z.string(),
  senderEncryptedSignaturePublicKey: z.string(),
  senderEncryptedSignature: z.string(),
  createdAt: z.coerce.date(),
});

export type MessageData = z.infer<typeof MessageDataSchema>;
