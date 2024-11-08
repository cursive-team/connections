import { createActivityBackup, createChipBackup } from "@/lib/backup";
import { Chip } from "@/lib/storage/types";
import { createRegisterChipActivity } from "@/lib/activity";
import { saveBackupAndUpdateStorage } from "../utils";
import { getUserAndSession } from ".";
import { ChipIssuer } from "@types";

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

export const getChipIssuers = async (): Promise<ChipIssuer[]> => {
  const { user } = await getUserAndSession();

  const issuerSet = new Set<ChipIssuer>();
  for (const chip of user.chips) {
    issuerSet.add(chip.issuer);
  }

  return Array.from(issuerSet);
}
