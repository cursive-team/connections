import { ClientStorage, InitialStorageData } from "..";
import {
  deleteSession,
  getSession,
  saveSession,
} from "@/lib/storage/localStorage/session";
import { deleteUser, saveUser } from "@/lib/storage/localStorage/user";
import { Session } from "@/lib/storage/types";

export class LocalStorage implements ClientStorage {
  async loadInitialStorageData(
    initialStorageData: InitialStorageData
  ): Promise<void> {
    const user = initialStorageData.user;
    const session = {
      value: initialStorageData.authTokenValue,
      expiresAt: initialStorageData.authTokenExpiresAt,
      backupMasterPassword: initialStorageData.backupMasterPassword,
      lastBackupFetchedAt: initialStorageData.lastBackupFetchedAt,
    };

    saveUser(user);
    saveSession(session);
  }

  async deleteStorageData(): Promise<void> {
    deleteUser();
    deleteSession();
  }

  async getSession(): Promise<Session | undefined> {
    return getSession();
  }

  async saveSession(session: Session): Promise<void> {
    return saveSession(session);
  }
}
