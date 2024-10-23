import {
  generateEncryptionKeyPair,
  encrypt,
  decrypt,
} from "@/lib/crypto/encrypt";
import { sign, verify } from "@/lib/crypto/sign";
import { CreateMessageData, MessageData } from "@types";

export * from "./tapBack";

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

  // Sign the serialized data
  const signature = sign(senderSignaturePrivateKey, serializedData);

  // Encrypt the serialized data
  const encryptedData = await encrypt(
    senderEphemeralEncryptionPrivateKey,
    receiverEncryptionPublicKey,
    serializedData
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

  const serializedData = await decrypt(
    encryptionPrivateKey,
    senderEphemeralEncryptionPublicKey,
    encryptedData
  );

  // Verify the signature
  const isValid = verify(senderSignaturePublicKey, serializedData, signature);

  if (!isValid) {
    throw new Error("Invalid signature");
  }

  return {
    serializedData,
    senderSignaturePublicKey,
  };
};
