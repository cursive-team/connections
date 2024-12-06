import { upsertConnectionBackup } from "@/lib/backup";
import { saveBackupAndUpdateStorage } from "@/lib/storage/localStorage/utils";
import { getUserAndSession } from "@/lib/storage/localStorage/user";

export const upsertConnectionRefreshPSI = async (
  connectionUsername: string,
  refreshPSI: boolean,
): Promise<void> => {
  const { user, session } = await getUserAndSession();

  const connection = user.connections[connectionUsername];
  if (!connection) {
    throw new Error("Connection not found");
  }

  const updatedConnection = {
    ...connection,
    refreshPSI: refreshPSI,
  };

  const connectionBackup = upsertConnectionBackup({
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