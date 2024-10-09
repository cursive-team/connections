import { createActivityBackup } from "@/lib/backup";
import { Activity } from "@/lib/storage/types";
import { saveBackupAndUpdateStorage } from "../utils";
import { getUserAndSession } from ".";

export const addActivity = async (activity: Activity): Promise<void> => {
  const { user, session } = await getUserAndSession();

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
