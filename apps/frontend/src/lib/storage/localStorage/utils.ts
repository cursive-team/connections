import { CreateBackupData } from "@types";
import { Session, User } from "../types";
import { getSession, saveSession } from "./session";
import { getUser, saveUser } from "./user";
import { appendBackupData } from "@/lib/backup";

export const saveToLocalStorage = (key: string, value: string): void => {
  localStorage.setItem(key, value);
};

export const getFromLocalStorage = (key: string): string | null => {
  return localStorage.getItem(key);
};

export const deleteFromLocalStorage = (key: string): void => {
  localStorage.removeItem(key);
};

export const getUserAndSession = (): { user: User; session: Session } => {
  const user = getUser();
  const session = getSession();

  if (!user) {
    throw new Error("User not found");
  }
  if (!session || session.authTokenExpiresAt < new Date()) {
    throw new Error("Session expired");
  }

  return { user, session };
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
