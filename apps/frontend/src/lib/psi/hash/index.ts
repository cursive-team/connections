import { sha256 } from "js-sha256";

export const hashCommit = async (
  privateKey: string,
  publicKey: string,
  data: string[]
): Promise<string[]> => {
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

  // Convert the shared secret to a hex string
  const sharedSecretHex = Buffer.from(sharedSecret).toString("hex");
  // Create an array of hashes from the data array
  const hashes = data.map((item) => {
    const hashInput = item + sharedSecretHex;
    return sha256(hashInput);
  });

  return hashes;
};
