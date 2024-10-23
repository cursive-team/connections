import { MessageData } from "@types";
import {
  decryptReceivedMessage,
  parseSerializedTapBackMessage,
  TapBackMessage,
} from "@/lib/message";
import { saveBackupAndUpdateStorage } from "../../../utils";
import { getUserAndSession } from "../..";

export const processNewMessages = async (
  messages: MessageData[]
): Promise<void> => {
  if (messages.length === 0) {
    return;
  }

  const { user, session } = await getUserAndSession();

  const connectionTapBacks: Record<string, TapBackMessage[]> = {};

  let lastMessageTimestamp: Date | null = null;
  for (const message of messages) {
    // Ensure messages are in order and update lastMessageTimestamp
    if (lastMessageTimestamp && message.createdAt < lastMessageTimestamp) {
      throw new Error("Messages are not in order");
    }
    lastMessageTimestamp = message.createdAt;

    try {
      const { serializedData, senderSignaturePublicKey } =
        await decryptReceivedMessage({
          messageData: message,
          encryptionPrivateKey: user.encryptionPrivateKey,
        });

      // Only handle tap back messages for now
      // TODO: Handle other message types
      const tapBackMessage = parseSerializedTapBackMessage(serializedData);
      if (Object.keys(connectionTapBacks).includes(senderSignaturePublicKey)) {
        connectionTapBacks[senderSignaturePublicKey] = [
          ...connectionTapBacks[senderSignaturePublicKey],
          tapBackMessage,
        ];
      } else {
        connectionTapBacks[senderSignaturePublicKey] = [tapBackMessage];
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  }

  if (!lastMessageTimestamp) {
    throw new Error("No messages found");
  }

  // TODO: Add user info to tap back messages
  // TODO: Add connection backup
  // TODO: Add last message fetched at backup
};
