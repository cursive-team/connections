import { BASE_API_URL } from "@/constants";
import { generateEncryptionKeyPair } from "../crypto/encrypt";
import { generateSignatureKeyPair } from "../crypto/sign";
import { generateSalt, hashPassword } from "../crypto/backup";
import { ErrorResponse, UserRegisterResponse } from "@types";

export async function registerUser(
  email: string,
  password: string
): Promise<UserRegisterResponse> {
  const { publicKey: encryptionPublicKey } = await generateEncryptionKeyPair();
  const { verifyingKey: signaturePublicKey } = generateSignatureKeyPair();

  const passwordSalt = generateSalt();
  const passwordHash = await hashPassword(password, passwordSalt);

  const response = await fetch(`${BASE_API_URL}/api/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      signaturePublicKey,
      encryptionPublicKey,
      passwordSalt,
      passwordHash,
    }),
  });

  if (!response.ok) {
    const { error }: ErrorResponse = await response.json();
    throw new Error(error);
  }

  const data: UserRegisterResponse = await response.json();
  return data;
}
