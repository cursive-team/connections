import {
  saveToLocalStorage,
  getFromLocalStorage,
} from "@/lib/storage/localStorage/utils";
import { Session, User, UserSchema } from "@/lib/storage/types";
import { getSession } from "../session";

const USER_STORAGE_KEY = "user";

export const saveUser = (user: User): void => {
  saveToLocalStorage(USER_STORAGE_KEY, JSON.stringify(user));
};

export const getUser = (): User | undefined => {
  const userString = getFromLocalStorage(USER_STORAGE_KEY);
  if (!userString) return undefined;

  try {
    const parsedUser = JSON.parse(userString);
    return UserSchema.parse(parsedUser);
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return undefined;
  }
};

export const deleteUser = (): void => {
  localStorage.removeItem(USER_STORAGE_KEY);
};

export const getUserAndSession = async (): Promise<{
  user: User;
  session: Session;
}> => {
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
