import { ChipIssuer, CreateMessageData } from "@types";
import {
  createEncryptedMessage,
  generateSerializedTapBackMessage,
} from "@/lib/message";
import { getUserAndSession } from "@/lib/storage/localStorage/user";
import { SentMessage, SentMessageSchema } from "@/lib/storage/types";
import { getUserShareableData } from "@/lib/user";
import { createActivityBackup, createConnectionBackup } from "@/lib/backup";
import { saveBackupAndUpdateStorage } from "../../../utils";
import { createTapBackSentActivity } from "@/lib/activity";

export const createTapBackMessage = async (
  connectionUsername: string,
  chipIssuer: ChipIssuer
): Promise<CreateMessageData> => {
  const { user, session } = await getUserAndSession();

  const connection = user.connections[connectionUsername];
  if (!connection) {
    throw new Error(`Connection not found for username: ${connectionUsername}`);
  }

  // Find the chip for the issuer
  // Use user chip if no matching chip exists
  let tapBackChipPrivateKey: string | undefined;
  let tapBackChipPublicKey: string | undefined;
  let tapBackChipIssuer: ChipIssuer = chipIssuer;
  const chip = user.chips.find((chip) => chip.issuer === chipIssuer);
  if (!chip) {
    tapBackChipPrivateKey = user.signaturePrivateKey;
    tapBackChipPublicKey = user.userData.signaturePublicKey;
    tapBackChipIssuer = ChipIssuer.USER;
  } else {
    tapBackChipPrivateKey = chip.privateKey;
    tapBackChipPublicKey = chip.publicKey;
  }

  const { serializedMessage, messageTimestamp } =
    await generateSerializedTapBackMessage({
      user: getUserShareableData(user.userData),
      chipPrivateKey: tapBackChipPrivateKey,
      chipPublicKey: tapBackChipPublicKey,
      chipIssuer: tapBackChipIssuer,
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

  // Create activity for sending tap back
  const tapBackSentActivity = createTapBackSentActivity(connectionUsername);
  const tapBackSentActivityBackup = createActivityBackup({
    email: user.email,
    password: session.backupMasterPassword,
    activity: tapBackSentActivity,
  });

  await saveBackupAndUpdateStorage({
    user,
    session,
    newBackupData: [connectionBackup, tapBackSentActivityBackup],
  });

  return createEncryptedMessage({
    receiverSignaturePublicKey: connection.user.signaturePublicKey,
    receiverEncryptionPublicKey: connection.user.encryptionPublicKey,
    serializedData: serializedMessage,
    senderSignaturePublicKey: user.userData.signaturePublicKey,
    senderSignaturePrivateKey: user.signaturePrivateKey,
  });
};
