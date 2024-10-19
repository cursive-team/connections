import { createActivityBackup, createConnectionBackup } from "@/lib/backup";
import { saveBackupAndUpdateStorage } from "../../utils";
import { PSIData, PSIDataSchema } from "@/lib/storage/types";
import { getUserAndSession } from "..";
import { createPSIActivity } from "@/lib/activity";

export const updatePSI = async (
  connectionUsername: string,
  psiData: PSIData
): Promise<void> => {
  const { user, session } = await getUserAndSession();

  const connection = user.connections[connectionUsername];
  if (!connection) {
    throw new Error("Connection not found");
  }

  const validatedPSIData = PSIDataSchema.parse({
    ...psiData,
    lastUpdatedAt: new Date(),
  });

  const updatedConnection = {
    ...connection,
    psi: validatedPSIData,
  };

  const connectionBackup = createConnectionBackup({
    email: user.email,
    password: session.backupMasterPassword,
    connection: updatedConnection,
  });

  // Create activity for running PSI
  const psiActivity = createPSIActivity(connectionUsername);
  const psiActivityBackup = createActivityBackup({
    email: user.email,
    password: session.backupMasterPassword,
    activity: psiActivity,
  });

  await saveBackupAndUpdateStorage({
    user,
    session,
    newBackupData: [connectionBackup, psiActivityBackup],
  });
};
