import { BASE_API_URL } from "@/config";
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

export async function loginUser(username: string): Promise<UserLoginResponse> {
  try {
    const request: UserLoginRequest = { username };
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

    return validatedData;
  } catch (error) {
    console.error("Login error:", errorToString(error));
    throw new Error(
      "Failed to login. Please check your credentials and try again."
    );
  }
}

export async function processLoginResponse(
  loginResponse: UserLoginResponse,
  backupSalt: string,
  password: string
): Promise<void> {
  const { authToken, backupData, passwordSalt, passwordHash } = loginResponse;

  const computedPasswordHash = await hashPassword(password, passwordSalt);
  if (computedPasswordHash !== passwordHash) {
    throw new Error("Invalid password");
  }

  const { user, submittedAt } = processUserBackup({
    email: backupSalt,
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
}
