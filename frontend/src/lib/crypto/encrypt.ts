export const IV_LENGTH = 12;

export const generateEncryptionKeyPair = async (): Promise<{
  publicKey: string;
  privateKey: string;
}> => {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    ["deriveKey", "deriveBits"]
  );
  const publicKey = await window.crypto.subtle.exportKey(
    "raw",
    keyPair.publicKey
  );
  const privateKey = await window.crypto.subtle.exportKey(
    "pkcs8",
    keyPair.privateKey
  );

  return {
    publicKey: Buffer.from(publicKey).toString("base64"),
    privateKey: Buffer.from(privateKey).toString("base64"),
  };
};

export const encrypt = async (
  privateKey: string,
  publicKey: string,
  data: string
): Promise<string> => {
  const importedPrivateKey = await window.crypto.subtle.importKey(
    "pkcs8",
    Buffer.from(privateKey, "base64"),
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    false,
    ["deriveBits"]
  );
  const importedPublicKey = await window.crypto.subtle.importKey(
    "raw",
    Buffer.from(publicKey, "base64"),
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    []
  );
  const sharedSecret = await window.crypto.subtle.deriveBits(
    {
      name: "ECDH",
      public: importedPublicKey,
    },
    importedPrivateKey,
    256
  );

  // Encrypt the data using AES-GCM with the derived shared secret
  const encodedData = new TextEncoder().encode(data);
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const aesGcmParams = {
    name: "AES-GCM",
    iv: iv,
  };
  const aesKey = await window.crypto.subtle.importKey(
    "raw",
    sharedSecret,
    aesGcmParams,
    false,
    ["encrypt"]
  );
  const encryptedContent = await window.crypto.subtle.encrypt(
    aesGcmParams,
    aesKey,
    encodedData
  );

  // The IV needs to be stored along with the encrypted data for decryption
  const encryptedDataWithIv = new Uint8Array(
    iv.length + encryptedContent.byteLength
  );
  encryptedDataWithIv.set(iv);
  encryptedDataWithIv.set(new Uint8Array(encryptedContent), iv.length);

  return Buffer.from(encryptedDataWithIv).toString("base64");
};

export const decrypt = async (
  privateKey: string,
  publicKey: string,
  encryptedData: string
): Promise<string> => {
  const importedPrivateKey = await window.crypto.subtle.importKey(
    "pkcs8",
    Buffer.from(privateKey, "base64"),
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    false,
    ["deriveBits"]
  );
  const importedPublicKey = await window.crypto.subtle.importKey(
    "raw",
    Buffer.from(publicKey, "base64"),
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    []
  );
  const sharedSecret = await window.crypto.subtle.deriveBits(
    {
      name: "ECDH",
      public: importedPublicKey,
    },
    importedPrivateKey,
    256
  );

  const encryptedDataBuffer = Buffer.from(encryptedData, "base64").buffer;
  const iv = new Uint8Array(encryptedDataBuffer, 0, IV_LENGTH);
  const data = new Uint8Array(encryptedDataBuffer, IV_LENGTH);
  const aesKey = await window.crypto.subtle.importKey(
    "raw",
    sharedSecret,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );

  const decryptedContent = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    aesKey,
    data
  );

  const decoder = new TextDecoder();
  const decryptedData = decoder.decode(decryptedContent);

  return decryptedData;
};
