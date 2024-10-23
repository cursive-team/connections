import { ChipIssuer, CreateMessageData } from "@types";
import {
  createEncryptedMessage,
  generateSerializedTapBackMessage,
} from "@/lib/message";
import { getUserAndSession } from "@/lib/storage/localStorage/user";
import { SentMessage, SentMessageSchema } from "@/lib/storage/types";
import { createConnectionBackup } from "@/lib/backup";
import { saveBackupAndUpdateStorage } from "../../../utils";

export const createTapBackMessage = async (
  connectionUsername: string,
  chipIssuer: ChipIssuer
): Promise<CreateMessageData> => {
  const { user, session } = await getUserAndSession();

  const connection = user.connections[connectionUsername];
  if (!connection) {
    throw new Error(`Connection not found for username: ${connectionUsername}`);
  }

  const chip = user.chips.find((chip) => chip.issuer === chipIssuer);
  if (!chip) {
    throw new Error(`Chip not found for issuer: ${chipIssuer}`);
  }

  const { serializedMessage, messageTimestamp } =
    await generateSerializedTapBackMessage({
      chipPrivateKey: chip.privateKey,
      chipPublicKey: chip.publicKey,
      chipIssuer,
    });

  const newSentMessage: SentMessage = SentMessageSchema.parse({
    serializedData: serializedMessage,
    timestamp: messageTimestamp,
  });

  const updatedConnection = {
    ...connection,
    sentMessages: [...connection.sentMessages, newSentMessage],
  };

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
    senderSignaturePublicKey: user.signaturePrivateKey,
    senderSignaturePrivateKey: user.signaturePrivateKey,
  });
};
