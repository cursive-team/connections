import { appendBackupData, createConnectionBackup } from "@/lib/backup";
import { getUser, saveUser } from "..";
import { getSession, saveSession } from "../../session";
import { CommentData, CommentDataSchema } from "@/lib/storage/types";

export const updateComment = async (
  connectionSignaturePublicKey: string,
  commentData: CommentData
): Promise<void> => {
  const user = getUser();
  const session = getSession();

  if (!user) {
    throw new Error("User not found");
  }
  if (!session || session.authTokenExpiresAt < new Date()) {
    throw new Error("Session expired");
  }

  const connection = user.connections[connectionSignaturePublicKey];
  if (!connection) {
    throw new Error("Connection not found");
  }

  const validatedCommentData = CommentDataSchema.parse({
    ...commentData,
    lastUpdatedAt: new Date(),
  });

  const updatedConnection = {
    ...connection,
    comment: validatedCommentData,
  };

  const connectionBackup = createConnectionBackup({
    email: user.email,
    password: session.backupMasterPassword,
    connection: updatedConnection,
  });

  const { updatedUser, updatedSubmittedAt } = await appendBackupData({
    email: user.email,
    password: session.backupMasterPassword,
    authToken: session.authTokenValue,
    newBackupData: [connectionBackup],
    existingUser: user,
    previousSubmittedAt: session.lastBackupFetchedAt,
  });

  saveUser(updatedUser);
  saveSession({
    ...session,
    lastBackupFetchedAt: updatedSubmittedAt,
  });
};
