import { ClientStorage, InitialStorageData } from "..";
import {
  deleteSession,
  getSession,
  saveSession,
} from "@/lib/storage/localStorage/session";
import { deleteUser, getUser, saveUser } from "@/lib/storage/localStorage/user";
import { Chip, Session, User } from "@/lib/storage/types";
import { addChip } from "@/lib/storage/localStorage/chip";

export class LocalStorage implements ClientStorage {
  async loadInitialStorageData(
    initialStorageData: InitialStorageData
  ): Promise<void> {
    const user = initialStorageData.user;
    const session = {
      authTokenValue: initialStorageData.authTokenValue,
      authTokenExpiresAt: initialStorageData.authTokenExpiresAt,
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

  async getUser(): Promise<User | undefined> {
    return getUser();
  }

  async getSession(): Promise<Session | undefined> {
    return getSession();
  }

  async addChip(chip: Chip): Promise<void> {
    return addChip(chip);
  }
}
