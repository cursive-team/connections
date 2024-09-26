import { ClientStorage, InitialData } from "..";
import { loadUserFromBackup } from "@/lib/backup";
import { getSession, saveSession } from "@/lib/storage/localStorage/session";
import { saveUser } from "@/lib/storage/localStorage/user";
import { Session } from "@/lib/storage/types";

export class LocalStorage implements ClientStorage {
  async loadInitialData(initialData: InitialData): Promise<void> {
    const user = loadUserFromBackup(initialData.backupData);
    const session = {
      value: initialData.authTokenValue,
      expiresAt: initialData.authTokenExpiresAt,
      backupMasterPassword: initialData.backupMasterPassword,
      lastBackupFetchedAt: initialData.lastBackupFetchedAt,
    };

    saveUser(user);
    saveSession(session);
  }

  async getSession(): Promise<Session | undefined> {
    return getSession();
  }

  async saveSession(session: Session): Promise<void> {
    return saveSession(session);
  }
}
