import {
  deleteFromLocalStorage,
  getFromLocalStorage,
  saveToLocalStorage,
} from "@/lib/storage/localStorage/utils";
import { Session, SessionSchema } from "@/lib/storage/types";

export const SESSION_STORAGE_KEY = "session";

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
