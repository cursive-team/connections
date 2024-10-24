import { ChipIssuer, CreateMessageData } from "@types";
import {
  createEncryptedMessage,
  generateSerializedTapBackMessage,
} from "@/lib/message";
import { getUserAndSession } from "@/lib/storage/localStorage/user";
import { SentMessage, SentMessageSchema, UserData } from "@/lib/storage/types";
import { createActivityBackup, createConnectionBackup } from "@/lib/backup";
import { saveBackupAndUpdateStorage } from "../../../utils";
import { createTapBackSentActivity } from "@/lib/activity";

// TODO: Generalize this based on user preferences
export const getUserShareableData = (userData: UserData): UserData => {
  return {
    username: userData.username,
    displayName: userData.displayName,
    bio: userData.bio,
    signaturePublicKey: userData.signaturePublicKey,
    encryptionPublicKey: userData.encryptionPublicKey,
    psiPublicKeyLink: userData.psiPublicKeyLink,
    twitter: userData.twitter,
    telegram: userData.telegram,
  };
};

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
      user: getUserShareableData(user.userData),
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
