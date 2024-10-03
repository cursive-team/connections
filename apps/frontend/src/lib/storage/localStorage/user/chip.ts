import { createActivityBackup, createChipBackup } from "@/lib/backup";
import { Chip } from "@/lib/storage/types";
import { createRegisterChipActivity } from "@/lib/activity";
import { getUserAndSession, saveBackupAndUpdateStorage } from "../utils";

export const addChip = async (chip: Chip): Promise<void> => {
  const { user, session } = getUserAndSession();

  const chipBackup = createChipBackup({
    email: user.email,
    password: session.backupMasterPassword,
    chip,
  });

  // Create activity for registering a chip
  const registerChipActivity = createRegisterChipActivity(chip.issuer, chip.id);
  const registerChipActivityBackup = createActivityBackup({
    email: user.email,
    password: session.backupMasterPassword,
    activity: registerChipActivity,
  });

  await saveBackupAndUpdateStorage({
    user,
    session,
    newBackupData: [chipBackup, registerChipActivityBackup],
  });
};
