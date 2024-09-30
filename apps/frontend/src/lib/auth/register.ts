import { BASE_API_URL } from "@/constants";
import { generateEncryptionKeyPair } from "@/lib/crypto/encrypt";
import { generateSignatureKeyPair } from "@/lib/crypto/sign";
import { generateSalt, hashPassword } from "@/lib/crypto/backup";
import {
  ErrorResponse,
  UserRegisterRequest,
  UserRegisterResponseSchema,
  errorToString,
} from "@types";
import { createInitialBackup, processUserBackup } from "@/lib/backup";
import { User } from "@/lib/storage/types";
import { storage } from "@/lib/storage";

/**
 * Registers a user and loads initial storage data.
 * @param email - The email of the user.
 * @param password - The password of the user.
 * @param displayName - The display name of the user.
 * @param bio - The bio of the user.
 */
export async function registerUser(
  email: string,
  password: string,
  displayName: string,
  bio: string
): Promise<void> {
  const { publicKey: encryptionPublicKey, privateKey: encryptionPrivateKey } =
    await generateEncryptionKeyPair();
  const { verifyingKey: signaturePublicKey, signingKey: signaturePrivateKey } =
    generateSignatureKeyPair();

  const passwordSalt = generateSalt();
  const passwordHash = await hashPassword(password, passwordSalt);

  // User data with provided displayName and bio
  const user: User = {
    email,
    signaturePrivateKey,
    encryptionPrivateKey,
    lastMessageFetchedAt: new Date(),
    userData: {
      displayName,
      bio,
      signaturePublicKey,
      encryptionPublicKey,
    },
    chips: [],
    connections: {},
    activities: [],
  };

  const initialBackupData = createInitialBackup({
    email,
    password,
    user,
  });

  const request: UserRegisterRequest = {
    email,
    signaturePublicKey,
    encryptionPublicKey,
    passwordSalt,
    passwordHash,
    initialBackupData,
  };
  const response = await fetch(`${BASE_API_URL}/user/register`, {
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
  try {
    const validatedData = UserRegisterResponseSchema.parse(rawData);
    const { authToken, backupData } = validatedData;

    // Parse the user from the backup data
    const { user, submittedAt } = processUserBackup({
      email,
      password,
      backupData,
    });

    // Load the initial storage data
    await storage.loadInitialStorageData({
      user,
      authTokenValue: authToken.value,
      authTokenExpiresAt: authToken.expiresAt,
      backupMasterPassword: password,
      lastBackupFetchedAt: submittedAt,
    });

    return;
  } catch (error) {
    throw new Error(errorToString(error));
  }
}
