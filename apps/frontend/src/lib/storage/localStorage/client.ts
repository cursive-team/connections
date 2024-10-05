import { ClientStorage, InitialStorageData } from "..";
import {
  deleteSession,
  getSession,
  saveSession,
} from "@/lib/storage/localStorage/session";
import { deleteUser, getUser, saveUser } from "@/lib/storage/localStorage/user";
import {
  Activity,
  Chip,
  CommentData,
  Session,
  User,
  UserData,
} from "@/lib/storage/types";
import { addChip } from "@/lib/storage/localStorage/user/chip";
import { updateUserData } from "@/lib/storage/localStorage/user/userData";
import { ChipTapResponse } from "@types";
import { addTap } from "@/lib/storage/localStorage/user/connection/tap";
import { updateComment } from "@/lib/storage/localStorage/user/connection/comment";
import { addActivity } from "@/lib/storage/localStorage/user/activity";

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

  async addActivity(activity: Activity): Promise<void> {
    return addActivity(activity);
  }
}
