import {
  Activity,
  Chip,
  CommentData,
  Session,
  TapInfo,
  User,
  UserData,
} from "./types";
import { LocalStorage } from "./localStorage/client";
import { ChipTapResponse } from "@types";

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
  getUserAndSession(): Promise<{ user: User; session: Session }>;
  getUser(): Promise<User | undefined>;
  getSession(): Promise<Session | undefined>;
  saveTapInfo(tapInfo: TapInfo): Promise<void>;
  loadSavedTapInfo(): Promise<TapInfo | undefined>;
  deleteSavedTapInfo(): Promise<void>;
  updateUserData(userData: UserData): Promise<void>;
  addChip(chip: Chip): Promise<void>;
  addTap(tapResponse: ChipTapResponse): Promise<void>;
  updateComment(
    connectionUsername: string,
    comment: CommentData
  ): Promise<void>;
  addActivity(activity: Activity): Promise<void>;
}

const storage = new LocalStorage();
export { storage };
