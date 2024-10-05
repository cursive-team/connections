import { createConnectionBackup } from "@/lib/backup";
import { getUserAndSession, saveBackupAndUpdateStorage } from "../../utils";
import { CommentData, CommentDataSchema } from "@/lib/storage/types";

export const updateComment = async (
  connectionUsername: string,
  commentData: CommentData
): Promise<void> => {
  const { user, session } = getUserAndSession();

  const connection = user.connections[connectionUsername];
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

  await saveBackupAndUpdateStorage({
    user,
    session,
    newBackupData: [connectionBackup],
  });
};
