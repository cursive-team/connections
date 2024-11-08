import {
  Activity,
  Chip,
  CommentData,
  PSIData,
  Session,
  TapInfo,
  User,
  UserData,
} from "./types";
import { LocalStorage } from "./localStorage/client";
import {
  AccessToken,
  ChipIssuer,
  ChipTapResponse,
  CreateMessageData,
  DataImportSource,
  MessageData,
} from "@types";

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
  saveOAuthAccessToken(app: DataImportSource, token: AccessToken): Promise<void>;
  getOAuthAccessToken(app: DataImportSource): Promise<AccessToken | undefined>;
  deleteOAuthAccessToken(app: DataImportSource): Promise<void>;
  saveTapInfo(tapInfo: TapInfo): Promise<void>;
  loadSavedTapInfo(): Promise<TapInfo | undefined>;
  deleteSavedTapInfo(): Promise<void>;
  updateUserData(userData: UserData): Promise<void>;
  addChip(chip: Chip): Promise<void>;
  addUserTap(tapResponse: ChipTapResponse): Promise<void>;
  addLocationTap(tapResponse: ChipTapResponse): Promise<void>;
  updateComment(
    connectionUsername: string,
    comment: CommentData
  ): Promise<void>;
  updatePSI(connectionUsername: string, psiData: PSIData): Promise<void>;
  addActivity(activity: Activity): Promise<void>;
  processNewMessages(messages: MessageData[]): Promise<void>;
  createTapBackMessage(
    connectionUsername: string,
    chipIssuer: ChipIssuer
  ): Promise<CreateMessageData>;
}

const storage = new LocalStorage();
export { storage };
