import { BASE_API_URL } from "@/constants";
import { storage } from "@/lib/storage";
import { processUserBackup } from "@/lib/backup";
import {
  ErrorResponse,
  UserLoginRequest,
  UserLoginResponse,
  UserLoginResponseSchema,
  errorToString,
} from "@types";
import { hashPassword } from "@/lib/crypto/backup";

export async function loginUser(
  email: string,
  password: string
): Promise<void> {
  try {
    const request: UserLoginRequest = { email };
    const response = await fetch(`${BASE_API_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const { error }: ErrorResponse = await response.json();
      throw new Error(error);
    }

    const rawData = await response.json();
    const validatedData: UserLoginResponse =
      UserLoginResponseSchema.parse(rawData);

    const { authToken, backupData, passwordSalt, passwordHash } = validatedData;

    const computedPasswordHash = await hashPassword(password, passwordSalt);
    if (computedPasswordHash !== passwordHash) {
      throw new Error("Invalid password");
    }

    const { user, submittedAt } = processUserBackup({
      email,
      password,
      backupData,
    });

    await storage.loadInitialStorageData({
      user,
      authTokenValue: authToken.value,
      authTokenExpiresAt: authToken.expiresAt,
      backupMasterPassword: password,
      lastBackupFetchedAt: submittedAt,
    });

    return;
  } catch (error) {
    console.error("Login error:", errorToString(error));
    throw new Error(
      "Failed to login. Please check your credentials and try again."
    );
  }
}
