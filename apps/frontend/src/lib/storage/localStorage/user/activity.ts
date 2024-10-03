import { createActivityBackup } from "@/lib/backup";
import { Activity } from "@/lib/storage/types";
import { getUserAndSession, saveBackupAndUpdateStorage } from "../utils";

export const addActivity = async (activity: Activity): Promise<void> => {
  const { user, session } = getUserAndSession();

  const activityBackup = createActivityBackup({
    email: user.email,
    password: session.backupMasterPassword,
    activity,
  });

  await saveBackupAndUpdateStorage({
    user,
    session,
    newBackupData: [activityBackup],
  });
};
