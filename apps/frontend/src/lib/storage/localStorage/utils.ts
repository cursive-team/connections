import { CreateBackupData } from "@types";
import { Session, User } from "../types";
import { saveSession } from "./session";
import { saveUser } from "./user";
import { appendBackupData } from "@/lib/backup";

export const saveToLocalStorage = (key: string, value: string): void => {
  localStorage.setItem(key, value);
};

// uncaughtException: ReferenceError: localStorage is not defined
export const getFromLocalStorage = (key: string): string | null => {
  return localStorage.getItem(key);
};

export const deleteFromLocalStorage = (key: string): void => {
  localStorage.removeItem(key);
};

export interface SaveBackupAndUpdateStorageArgs {
  user: User;
  session: Session;
  newBackupData: CreateBackupData[];
}
export const saveBackupAndUpdateStorage = async ({
  user,
  session,
  newBackupData,
}: SaveBackupAndUpdateStorageArgs): Promise<void> => {
  const { updatedUser, updatedSubmittedAt } = await appendBackupData({
    email: user.email,
    password: session.backupMasterPassword,
    authToken: session.authTokenValue,
    newBackupData,
    existingUser: user,
    previousSubmittedAt: session.lastBackupFetchedAt,
  });

  saveUser(updatedUser);
  saveSession({
    ...session,
    lastBackupFetchedAt: updatedSubmittedAt,
  });
};
