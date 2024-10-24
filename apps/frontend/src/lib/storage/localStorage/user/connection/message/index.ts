import { CreateBackupData, MessageData } from "@types";
import {
  decryptReceivedMessage,
  parseSerializedTapBackMessage,
  TapBackMessage,
} from "@/lib/message";
import { saveBackupAndUpdateStorage } from "../../../utils";
import { getUserAndSession } from "../..";
import { Connection } from "@/lib/storage/types";
import {
  createActivityBackup,
  createConnectionBackup,
  createLastMessageFetchedAtBackup,
} from "@/lib/backup";
import { createTapBackReceivedActivity } from "@/lib/activity";

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

  const newBackupEntries: CreateBackupData[] = [];

  Object.entries(connectionTapBacks).forEach(
    ([senderSignaturePublicKey, tapBackMessages]) => {
      if (tapBackMessages.length === 0) {
        return;
      }

      let updatedConnection: Connection =
        user.connections[senderSignaturePublicKey];
      // Create new connection if it doesn't exist
      if (!updatedConnection) {
        const firstTapBackMessage = tapBackMessages[0];
        updatedConnection = {
          user: firstTapBackMessage.user,
          taps: [],
          sentMessages: [],
        };
      }

      // Update connection with new tap back messages
      for (const tapBackMessage of tapBackMessages) {
        // Do not allow a connection to change username or keys
        if (
          updatedConnection.user.username !== tapBackMessage.user.username ||
          updatedConnection.user.signaturePublicKey !==
            tapBackMessage.user.signaturePublicKey ||
          updatedConnection.user.encryptionPublicKey !==
            tapBackMessage.user.encryptionPublicKey ||
          updatedConnection.user.psiPublicKeyLink !==
            tapBackMessage.user.psiPublicKeyLink
        ) {
          throw new Error("Connection cannot change username or keys");
        }

        updatedConnection = {
          ...updatedConnection,
          user: {
            ...updatedConnection.user,
            ...tapBackMessage.user,
          },
          taps: [...updatedConnection.taps, tapBackMessage.tap],
        };

        const tapBackReceivedActivity = createTapBackReceivedActivity(
          updatedConnection.user.username,
          lastMessageTimestamp
        );
        const tapBackReceivedActivityBackup = createActivityBackup({
          email: user.email,
          password: session.backupMasterPassword,
          activity: tapBackReceivedActivity,
        });
        newBackupEntries.push(tapBackReceivedActivityBackup);
      }

      // Only create one backup entry per sender
      const connectionBackup = createConnectionBackup({
        email: user.email,
        password: session.backupMasterPassword,
        connection: updatedConnection,
      });
      newBackupEntries.push(connectionBackup);
    }
  );

  // Update last message fetched at
  const lastMessageFetchedAtBackup = createLastMessageFetchedAtBackup({
    email: user.email,
    password: session.backupMasterPassword,
    lastMessageFetchedAt: lastMessageTimestamp,
  });
  newBackupEntries.push(lastMessageFetchedAtBackup);

  await saveBackupAndUpdateStorage({
    user,
    session,
    newBackupData: newBackupEntries,
  });
};
