import {
  deleteFromLocalStorage,
  getFromLocalStorage,
  saveToLocalStorage,
} from "..";
import { z } from "zod";

export const SESSION_STORAGE_KEY = "session";

export const SessionSchema = z.object({
  value: z.string(),
  expiresAt: z.coerce.date(),
  backupMasterPassword: z.string(),
  lastBackupFetchedAt: z.coerce.date(),
});

export type Session = z.infer<typeof SessionSchema>;

export const saveSession = (session: Session): void => {
  saveToLocalStorage(SESSION_STORAGE_KEY, JSON.stringify(session));
};

export const getSession = (): Session | undefined => {
  const sessionString = getFromLocalStorage(SESSION_STORAGE_KEY);
  if (sessionString) {
    try {
      const parsedSession = JSON.parse(sessionString);
      return SessionSchema.parse(parsedSession);
    } catch (error) {
      console.error("Failed to parse session:", error);
      return undefined;
    }
  }

  return undefined;
};

export const deleteSession = (): void => {
  deleteFromLocalStorage(SESSION_STORAGE_KEY);
};
