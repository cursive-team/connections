import { ClientStorage, InitialStorageData } from "..";
import {
  deleteSession,
  getSession,
  saveSession,
} from "@/lib/storage/localStorage/session";
import {
  deleteUser,
  getUser,
  getUserAndSession,
  saveUser,
  getUnregisteredUser,
  saveUnregisteredUser,
  deleteUnregisteredUser,
} from "@/lib/storage/localStorage/user";
import {
  Activity,
  Chip,
  CommentData,
  PSIData,
  Session,
  TapInfo,
  UnregisteredUser,
  User,
  UserData,
} from "@/lib/storage/types";
import { addChip, getChipIssuers } from "@/lib/storage/localStorage/user/chip";
import { updateUserData } from "@/lib/storage/localStorage/user/userData";
import {
  AccessToken,
  ChipIssuer,
  ChipTapResponse,
  CreateMessageData,
  DataImportSource,
  MessageData,
} from "@types";
import { addUserTap } from "@/lib/storage/localStorage/user/connection/tap";
import { updateComment } from "@/lib/storage/localStorage/user/connection/comment";
import { updatePSI } from "@/lib/storage/localStorage/user/connection/psi";
import { addActivity } from "@/lib/storage/localStorage/user/activity";
import {
  deleteSavedTapInfo,
  loadSavedTapInfo,
  saveTapInfo,
} from "@/lib/storage/localStorage/tapInfo";
import { createTapBackMessage } from "./user/connection/message/tapBack";
import {
  createEdgeMessageAndHandleBackup,
} from "./user/connection/message/edge";
import {
  createPSIMessageAndHandleBackup,
} from "@/lib/storage/localStorage/user/connection/message/psi";
import { processNewMessages } from "./user/connection/message";
import {
  deleteOAuthAccessToken,
  getOAuthAccessToken,
  saveOAuthAccessToken,
} from "@/lib/storage/localStorage/user/oauth";
import { addLocationTap } from "./user/location";
import { deleteAppImports } from "@/lib/storage/localStorage/user/imports";
import { ChipTap } from "@/lib/storage/types/user/tap";

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

  async getUserAndSession(): Promise<{ user: User; session: Session }> {
    return getUserAndSession();
  }

  async getUser(): Promise<User | undefined> {
    return getUser();
  }

  async getSession(): Promise<Session | undefined> {
    return getSession();
  }

  syncGetSession(): Session | undefined {
    return getSession();
  }

  async getUnregisteredUser(): Promise<UnregisteredUser | undefined> {
    return getUnregisteredUser();
  }

  async saveUnregisteredUser(user: UnregisteredUser): Promise<void> {
    return saveUnregisteredUser(user);
  }

  async deleteUnregisteredUser(): Promise<void> {
    return deleteUnregisteredUser();
  }

  async saveOAuthAccessToken(app: DataImportSource, token: AccessToken): Promise<void> {
    return saveOAuthAccessToken(app, token);
  }

  async getOAuthAccessToken(app: DataImportSource): Promise<AccessToken | undefined> {
    return getOAuthAccessToken(app);
  }

  async deleteOAuthAccessToken(app: DataImportSource): Promise<void> {
    return deleteOAuthAccessToken(app);
  }

  async deleteAppImports(app: DataImportSource): Promise<void> {
    return deleteAppImports(app);
  }

  async saveTapInfo(tapInfo: TapInfo): Promise<void> {
    return saveTapInfo(tapInfo);
  }

  async loadSavedTapInfo(): Promise<TapInfo | undefined> {
    return loadSavedTapInfo();
  }

  async deleteSavedTapInfo(): Promise<void> {
    return deleteSavedTapInfo();
  }

  async updateUserData(userData: UserData): Promise<void> {
    return updateUserData(userData);
  }

  async addChip(chip: Chip): Promise<void> {
    return addChip(chip);
  }

  async addUserTap(tapResponse: ChipTap): Promise<void> {
    return addUserTap(tapResponse);
  }

  async addLocationTap(tapResponse: ChipTapResponse): Promise<void> {
    return addLocationTap(tapResponse);
  }

  async getChipIssuers(): Promise<ChipIssuer[]> {
    return getChipIssuers();
  }

  async updateComment(
    connectionUsername: string,
    comment: CommentData
  ): Promise<void> {
    return updateComment(connectionUsername, comment);
  }

  async updatePSI(connectionUsername: string, psiData: PSIData): Promise<void> {
    return updatePSI(connectionUsername, psiData);
  }

  async addActivity(activity: Activity): Promise<void> {
    return addActivity(activity);
  }

  async createTapBackMessage(
    connectionUsername: string,
    chipIssuer: ChipIssuer
  ): Promise<CreateMessageData> {
    return createTapBackMessage(connectionUsername, chipIssuer);
  }

  async createEdgeMessageAndHandleBackup(
    connectionUsername: string,
    edgeId: string,
    sentHash: boolean,
    senderUsername: string,
  ): Promise<CreateMessageData> {
    return createEdgeMessageAndHandleBackup(connectionUsername, edgeId, sentHash, senderUsername);
  }

  async createPSIMessageAndHandleBackup(
    connectionUsername: string,
    senderUsername: string,
  ): Promise<CreateMessageData> {
    return createPSIMessageAndHandleBackup(connectionUsername, senderUsername);
  }

  async processNewMessages(messages: MessageData[]): Promise<void> {
    return processNewMessages(messages);
  }
}
