import { createActivityBackup, createChipBackup } from "@/lib/backup";
import { Chip } from "@/lib/storage/types";
import { createRegisterChipActivity } from "@/lib/activity";
import { saveBackupAndUpdateStorage } from "../utils";
import { getUserAndSession } from ".";

export const addChip = async (chip: Chip): Promise<void> => {
  const { user, session } = await getUserAndSession();

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
