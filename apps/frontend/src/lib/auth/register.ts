import { BASE_API_URL } from "@/constants";
import { generateEncryptionKeyPair } from "@/lib/crypto/encrypt";
import { generateSignatureKeyPair } from "@/lib/crypto/sign";
import { generateSalt, hashPassword } from "@/lib/crypto/backup";
import {
  ErrorResponse,
  UserRegisterRequest,
  UserRegisterResponse,
  UserRegisterResponseSchema,
  errorToString,
} from "@types";
import { createInitialBackup } from "@/lib/backup";
import { User } from "@/lib/storage/types";

export async function registerUser(
  email: string,
  password: string
): Promise<UserRegisterResponse> {
  const { publicKey: encryptionPublicKey, privateKey: encryptionPrivateKey } =
    await generateEncryptionKeyPair();
  const { verifyingKey: signaturePublicKey, signingKey: signaturePrivateKey } =
    generateSignatureKeyPair();

  const passwordSalt = generateSalt();
  const passwordHash = await hashPassword(password, passwordSalt);

  // Default user data
  const user: User = {
    email,
    signaturePrivateKey,
    encryptionPrivateKey,
    lastMessageFetchedAt: new Date(),
    userData: {
      displayName: "Bob", // TODO
      bio: "Hello, I am Bob", // TODO
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
    return validatedData;
  } catch (error) {
    throw new Error(errorToString(error));
  }
}
