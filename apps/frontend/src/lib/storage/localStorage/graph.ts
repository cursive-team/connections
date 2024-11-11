import { storage } from "@/lib/storage";
import { createToggleSocialGraphBackup } from "@/lib/backup";
import { saveBackupAndUpdateStorage } from "@/lib/storage/localStorage/utils";

export const toggleGraphConsent = async (): Promise<boolean> => {
  const { user, session } = await storage.getUserAndSession();
  if (user &&
    session &&
    session.authTokenValue &&
    session.authTokenExpiresAt > new Date()
  ) {
    const backup = createToggleSocialGraphBackup({
      email: user.email,
      password: session.backupMasterPassword
    });

    await saveBackupAndUpdateStorage({
      user,
      session,
      newBackupData: [backup]
    });

    return true;
  }
  return false;
}