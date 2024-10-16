import { PrismaPostgresClient } from "@/lib/controller/postgres/prisma/client";
import { MessageData, MessageDataSchema, CreateMessageData } from "@types";

PrismaPostgresClient.prototype.GetMessagesForUser = async function (
  userSignaturePublicKey: string,
  lastMessageFetchedAt: Date | undefined
): Promise<MessageData[]> {
  const prismaMessages = await this.prismaClient.message.findMany({
    where: {
      receiverSignaturePublicKey: userSignaturePublicKey,
      createdAt: {
        gt: lastMessageFetchedAt ?? new Date(0),
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return prismaMessages.map((prismaMessage) =>
    MessageDataSchema.parse({
      receiverSignaturePublicKey: prismaMessage.receiverSignaturePublicKey,
      senderEphemeralEncryptionPublicKey:
        prismaMessage.senderEphemeralEncryptionPublicKey,
      encryptedData: prismaMessage.encryptedData,
      senderEncryptedSignaturePublicKey:
        prismaMessage.senderEncryptedSignaturePublicKey,
      senderEncryptedSignature: prismaMessage.senderEncryptedSignature,
      createdAt: prismaMessage.createdAt,
    })
  );
};

PrismaPostgresClient.prototype.CreateMessages = async function (
  messages: CreateMessageData[]
): Promise<void> {
  const baseDate = new Date();
  await this.prismaClient.message.createMany({
    data: messages.map((message, index) => ({
      ...message,
      createdAt: new Date(baseDate.getTime() + index),
    })),
  });

  return;
};
