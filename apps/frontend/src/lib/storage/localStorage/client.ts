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
} from "@/lib/storage/localStorage/user";
import {
  Activity,
  Chip,
  CommentData,
  PSIData,
  Session,
  TapInfo,
  User,
  UserData,
} from "@/lib/storage/types";
import { addChip } from "@/lib/storage/localStorage/user/chip";
import { updateUserData } from "@/lib/storage/localStorage/user/userData";
import { ChipTapResponse } from "@types";
import { addTap } from "@/lib/storage/localStorage/user/connection/tap";
import { updateComment } from "@/lib/storage/localStorage/user/connection/comment";
import { updatePSI } from "@/lib/storage/localStorage/user/connection/psi";
import { addActivity } from "@/lib/storage/localStorage/user/activity";
import {
  deleteSavedTapInfo,
  loadSavedTapInfo,
  saveTapInfo,
} from "@/lib/storage/localStorage/tapInfo";

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

  async addTap(tapResponse: ChipTapResponse): Promise<void> {
    return addTap(tapResponse);
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
}
