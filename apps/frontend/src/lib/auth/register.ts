import { BASE_API_URL } from "@/config";
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
import { createRegisterActivity } from "../activity";

/**
 * Registers a user and loads initial storage data.
 * @param email - The email of the user.
 * @param password - The password of the user.
 * @param username - The username of the user.
 * @param displayName - The display name of the user.
 * @param bio - The bio of the user.
 * @param registeredWithPasskey - Whether the user registered with a passkey.
 */
export async function registerUser(
  email: string,
  password: string,
  username: string,
  displayName: string,
  bio: string,
  registeredWithPasskey: boolean
): Promise<void> {
  const { publicKey: encryptionPublicKey, privateKey: encryptionPrivateKey } =
    await generateEncryptionKeyPair();
  const { verifyingKey: signaturePublicKey, signingKey: signaturePrivateKey } =
    generateSignatureKeyPair();

  const passwordSalt = generateSalt();
  const passwordHash = await hashPassword(password, passwordSalt);

  const { psiPublicKeyLink, psiPrivateKey } = generatePsiKeyPair();

  // Add activity for registering
  const registerActivity = createRegisterActivity();
  const user: User = {
    email,
    signaturePrivateKey,
    encryptionPrivateKey,
    psiPrivateKey,
    lastMessageFetchedAt: new Date(),
    userData: {
      username,
      displayName,
      bio,
      signaturePublicKey,
      encryptionPublicKey,
      psiPublicKeyLink,
    },
    chips: [],
    connections: {},
    activities: [registerActivity],
  };

  const initialBackupData = createInitialBackup({
    email,
    password,
    user,
  });

  const request: UserRegisterRequest = {
    username,
    email,
    signaturePublicKey,
    encryptionPublicKey,
    psiPublicKeyLink,
    passwordSalt,
    passwordHash,
    registeredWithPasskey,
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
