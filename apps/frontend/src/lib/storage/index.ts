import { BackupData } from "@types";
import { getSession, saveSession, Session } from "./session";
import { saveUser } from "./user";
import { loadUserFromBackup } from "@/lib/backup";

export interface InitialData {
  backupData: BackupData[];
  authTokenValue: string;
  authTokenExpiresAt: Date;
  backupMasterPassword: string;
  lastBackupFetchedAt: Date;
}

export interface ClientStorage {
  loadInitialData(initialData: InitialData): void;
  getSession(): Session | undefined;
  saveSession(session: Session): void;
}

class LocalStorage implements ClientStorage {
  loadInitialData(initialData: InitialData): void {
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

  getSession(): Session | undefined {
    return getSession();
  }

  saveSession(session: Session): void {
    return saveSession(session);
  }
}

export const storage = new LocalStorage();

export const saveToLocalStorage = (key: string, value: string): void => {
  localStorage.setItem(key, value);
};

export const getFromLocalStorage = (key: string): string | null => {
  return localStorage.getItem(key);
};

export const deleteFromLocalStorage = (key: string): void => {
  localStorage.removeItem(key);
};
