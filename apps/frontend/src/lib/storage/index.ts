import { Session, User } from "./types";
import { LocalStorage } from "./localStorage/client";

export interface InitialStorageData {
  user: User;
  authTokenValue: string;
  authTokenExpiresAt: Date;
  backupMasterPassword: string;
  lastBackupFetchedAt: Date;
}

export interface ClientStorage {
  loadInitialStorageData(initialStorageData: InitialStorageData): Promise<void>;
  deleteStorageData(): Promise<void>;
  getSession(): Promise<Session | undefined>;
  saveSession(session: Session): Promise<void>;
}

const storage = new LocalStorage();
export { storage };
