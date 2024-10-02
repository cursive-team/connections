import { appendBackupData, createChipBackup } from "@/lib/backup";
import { Chip } from "@/lib/storage/types";
import { getUser, saveUser } from ".";
import { getSession, saveSession } from "../session";

export const addChip = async (chip: Chip): Promise<void> => {
  const user = getUser();
  const session = getSession();

  if (!user) {
    throw new Error("User not found");
  }
  if (!session || session.authTokenExpiresAt < new Date()) {
    throw new Error("Session expired");
  }

  const chipBackup = createChipBackup({
    email: user.email,
    password: session.backupMasterPassword,
    chip,
  });

  const { updatedUser, updatedSubmittedAt } = await appendBackupData({
    email: user.email,
    password: session.backupMasterPassword,
    authToken: session.authTokenValue,
    newBackupData: [chipBackup],
    existingUser: user,
    previousSubmittedAt: session.lastBackupFetchedAt,
  });

  saveUser(updatedUser);
  saveSession({
    ...session,
    lastBackupFetchedAt: updatedSubmittedAt,
  });
};
