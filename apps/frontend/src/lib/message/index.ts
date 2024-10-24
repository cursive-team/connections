import {
  generateEncryptionKeyPair,
  encrypt,
  decrypt,
} from "@/lib/crypto/encrypt";
import { sign, verify } from "@/lib/crypto/sign";
import {
  CreateMessageData,
  CreateMessagesRequest,
  GetMessagesRequest,
  MessageData,
} from "@types";

export * from "./tapBack";

import { BASE_API_URL } from "@/config";

export const sendMessages = async (
  request: CreateMessagesRequest
): Promise<void> => {
  const response = await fetch(`${BASE_API_URL}/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.statusText}`);
  }
};

export const fetchMessages = async ({
  authToken,
  lastMessageFetchedAt,
}: GetMessagesRequest): Promise<MessageData[]> => {
  const lastMessageFetchedAtParam = lastMessageFetchedAt
    ? `&lastMessageFetchedAt=${encodeURIComponent(
        lastMessageFetchedAt.toISOString()
      )}`
    : "";
  const response = await fetch(
    `${BASE_API_URL}/message?authToken=${encodeURIComponent(
      authToken
    )}${lastMessageFetchedAtParam}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch messages: ${response.statusText}`);
  }

  const messages: MessageData[] = await response.json();
  return messages;
};

interface CreateMessageArgs {
  receiverSignaturePublicKey: string;
  receiverEncryptionPublicKey: string;
  serializedData: string;
  senderSignaturePublicKey: string;
  senderSignaturePrivateKey: string;
}

export const createEncryptedMessage = async ({
  receiverSignaturePublicKey,
  receiverEncryptionPublicKey,
  serializedData,
  senderSignaturePublicKey,
  senderSignaturePrivateKey,
}: CreateMessageArgs): Promise<CreateMessageData> => {
  // Generate ephemeral encryption key pair
  const {
    publicKey: senderEphemeralEncryptionPublicKey,
    privateKey: senderEphemeralEncryptionPrivateKey,
  } = await generateEncryptionKeyPair();

  // Hex encode the serialized data
  const hexEncodedData = Buffer.from(serializedData).toString("hex");

  // Sign the hex encoded serialized data
  const signature = sign(senderSignaturePrivateKey, hexEncodedData);

  // Encrypt the hex encoded serialized data
  const encryptedData = await encrypt(
    senderEphemeralEncryptionPrivateKey,
    receiverEncryptionPublicKey,
    hexEncodedData
  );

  // Encrypt the sender's signature public key
  const senderEncryptedSignaturePublicKey = await encrypt(
    senderEphemeralEncryptionPrivateKey,
    receiverEncryptionPublicKey,
    senderSignaturePublicKey
  );

  // Encrypt the signature
  const senderEncryptedSignature = await encrypt(
    senderEphemeralEncryptionPrivateKey,
    receiverEncryptionPublicKey,
    signature
  );

  return {
    receiverSignaturePublicKey,
    senderEphemeralEncryptionPublicKey,
    encryptedData,
    senderEncryptedSignaturePublicKey,
    senderEncryptedSignature,
  };
};

export const decryptReceivedMessage = async ({
  messageData,
  encryptionPrivateKey,
}: {
  messageData: MessageData;
  encryptionPrivateKey: string;
}): Promise<{
  serializedData: string;
  senderSignaturePublicKey: string;
}> => {
  const {
    senderEphemeralEncryptionPublicKey,
    encryptedData,
    senderEncryptedSignaturePublicKey,
    senderEncryptedSignature,
  } = messageData;

  // Decrypt the sender's signature public key
  const senderSignaturePublicKey = await decrypt(
    encryptionPrivateKey,
    senderEphemeralEncryptionPublicKey,
    senderEncryptedSignaturePublicKey
  );

  // Decrypt the signature
  const signature = await decrypt(
    encryptionPrivateKey,
    senderEphemeralEncryptionPublicKey,
    senderEncryptedSignature
  );

  const hexEncodedData = await decrypt(
    encryptionPrivateKey,
    senderEphemeralEncryptionPublicKey,
    encryptedData
  );

  // Hex decode the serialized data
  const serializedData = Buffer.from(hexEncodedData, "hex").toString();

  // Verify the signature
  const isValid = verify(senderSignaturePublicKey, hexEncodedData, signature);

  if (!isValid) {
    throw new Error("Invalid signature");
  }

  return {
    serializedData,
    senderSignaturePublicKey,
  };
};
