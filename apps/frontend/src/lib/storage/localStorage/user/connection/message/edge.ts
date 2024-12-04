import { CreateMessageData } from "@types";
import { getUserAndSession } from "@/lib/storage/localStorage/user";
import { createEncryptedMessage, generateSerializedEdgeMessage } from "@/lib/message";
import { SentMessage, SentMessageSchema } from "@/lib/storage/types";
import { upsertConnectionBackup, createEdgeBackup } from "@/lib/backup";
import { saveBackupAndUpdateStorage } from "@/lib/storage/localStorage/utils";

export const createEdgeMessageAndHandleBackup = async (
  connectionUsername: string,
  edgeId: string,
  sentHash: boolean,
  senderUsername: string,
): Promise<CreateMessageData> => {
  const { user, session } = await getUserAndSession();

  const connection = user.connections[connectionUsername];
  if (!connection) {
    throw new Error(`Connection not found for username: ${connectionUsername}`);
  }

  const { serializedMessage, messageTimestamp } =
    await generateSerializedEdgeMessage({
      // Send both edgeId and sender username to recipient
      edgeId,
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
  const connectionBackup = upsertConnectionBackup({
    email: user.email,
    password: session.backupMasterPassword,
    connection: updatedConnection,
  });

  // Backup for local copy of edge
  const edgeBackup = createEdgeBackup({
    email: user.email,
    password: session.backupMasterPassword,

    // Backup arguments
    edgeId,
    sentHash,
    connectionUsername,
    isTapSender: true,
    timestamp: new Date(),
  })

  await saveBackupAndUpdateStorage({
    user,
    session,
    newBackupData: [connectionBackup, edgeBackup],
  });

  return createEncryptedMessage({
    receiverSignaturePublicKey: connection.user.signaturePublicKey,
    receiverEncryptionPublicKey: connection.user.encryptionPublicKey,
    serializedData: serializedMessage,
    senderSignaturePublicKey: user.userData.signaturePublicKey,
    senderSignaturePrivateKey: user.signaturePrivateKey,
  });
};

