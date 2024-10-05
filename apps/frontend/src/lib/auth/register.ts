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
import { generatePSIKeyPair, psiBlobUploadClient } from "../psi";

export interface RegisterUserArgs {
  signinToken: string;
  email: string;
  password: string;
  username: string;
  displayName: string;
  bio: string;
  telegramHandle?: string;
  twitterHandle?: string;
  registeredWithPasskey: boolean;
  passkeyAuthPublicKey?: string;
}

/**
 * Registers a user and loads initial storage data.
 * @param args - Object containing user registration details
 * @param args.signinToken - The signin token if registering with email.
 * @param args.email - The email of the user.
 * @param args.password - The password of the user.
 * @param args.username - The username of the user.
 * @param args.displayName - The display name of the user.
 * @param args.bio - The bio of the user.
 * @param args.telegramHandle - The telegram handle of the user.
 * @param args.twitterHandle - The twitter handle of the user.
 * @param args.registeredWithPasskey - Whether the user registered with a passkey.
 * @param args.passkeyAuthPublicKey - The public key of the authenticator if registering with passkey.
 */
export async function registerUser({
  signinToken,
  email,
  password,
  username,
  displayName,
  bio,
  telegramHandle,
  twitterHandle,
  registeredWithPasskey,
  passkeyAuthPublicKey,
}: RegisterUserArgs): Promise<void> {
  const { publicKey: encryptionPublicKey, privateKey: encryptionPrivateKey } =
    await generateEncryptionKeyPair();
  const { verifyingKey: signaturePublicKey, signingKey: signaturePrivateKey } =
    generateSignatureKeyPair();

  const passwordSalt = generateSalt();
  const passwordHash = await hashPassword(password, passwordSalt);

  const { psiPublicKey, psiPrivateKey } = await generatePSIKeyPair();

  // Upload PSI public key to blob storage
  const psiPublicKeyLink = await psiBlobUploadClient(
    "connectionsPsiPublicKey",
    JSON.stringify(psiPublicKey)
  );

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
      twitter: {
        username: twitterHandle,
      },
      telegram: {
        username: telegramHandle,
      },
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
    signinToken,
    username,
    email,
    signaturePublicKey,
    encryptionPublicKey,
    psiPublicKeyLink,
    passwordSalt,
    passwordHash,
    registeredWithPasskey,
    passkeyAuthPublicKey,
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
