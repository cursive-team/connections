import { CreateMessageData } from "@types";
import { getUserAndSession } from "@/lib/storage/localStorage/user";
import { createEncryptedMessage, generateSerializedPSIMessage } from "@/lib/message";
import { SentMessage, SentMessageSchema } from "@/lib/storage/types";
import { createConnectionBackup } from "@/lib/backup";
import { saveBackupAndUpdateStorage } from "@/lib/storage/localStorage/utils";

export const createPSIMessageAndHandleBackup = async (
  connectionUsername: string,
  senderUsername: string,
): Promise<CreateMessageData> => {
  const { user, session } = await getUserAndSession();

  const connection = user.connections[connectionUsername];
  if (!connection) {
    throw new Error(`Connection not found for username: ${connectionUsername}`);
  }

  const { serializedMessage, messageTimestamp } =
    await generateSerializedPSIMessage({
      // Send sender username to recipient
      senderUsername,
    });

  const newSentMessage: SentMessage = SentMessageSchema.parse({
    serializedData: serializedMessage,
    timestamp: messageTimestamp,
  });

  const updatedConnection = {
    ...connection,
    sentMessages: [...connection.sentMessages, newSentMessage],
  };

  // Backup for edge message to connection
  const connectionBackup = createConnectionBackup({
    email: user.email,
    password: session.backupMasterPassword,
    connection: updatedConnection,
  });

  await saveBackupAndUpdateStorage({
    user,
    session,
    newBackupData: [connectionBackup],
  });

  return createEncryptedMessage({
    receiverSignaturePublicKey: connection.user.signaturePublicKey,
    receiverEncryptionPublicKey: connection.user.encryptionPublicKey,
    serializedData: serializedMessage,
    senderSignaturePublicKey: user.userData.signaturePublicKey,
    senderSignaturePrivateKey: user.signaturePrivateKey,
  });
};

