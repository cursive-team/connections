import { BackupData } from "@types";
import { Session } from "./types";
import { LocalStorage } from "./localStorage/client";

export interface InitialData {
  backupData: BackupData[];
  authTokenValue: string;
  authTokenExpiresAt: Date;
  backupMasterPassword: string;
  lastBackupFetchedAt: Date;
}

export interface ClientStorage {
  loadInitialData(initialData: InitialData): Promise<void>;
  getSession(): Promise<Session | undefined>;
  saveSession(session: Session): Promise<void>;
}

const storage = new LocalStorage();
export { storage };
