import { iEnclaveClient } from "../interfaces";
import fetch from "cross-fetch";

export class NitroEnclaveClient implements iEnclaveClient {
  async GetAttestationDoc(): Promise<string> {
    const response = await fetch(
      `${process.env.ENCLAVE_SERVER_URL}/get-enclave-key`
    );

    if (!response.ok) {
      throw new Error(
        `Enclave server responded with status ${response.status}`
      );
    }

    const data = await response.json();
    return data.attestation_doc;
  }

  async HashWithSecret(encryptedInput: string): Promise<{
    inputWithSecretHash: string;
    secretHash: string;
  }> {
    if (!encryptedInput) {
      throw new Error("Encrypted input is required");
    }

    const response = await fetch(
      `${process.env.ENCLAVE_SERVER_URL}/hash-encrypted-input`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ encrypted_input: encryptedInput }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Enclave server responded with status ${response.status}`
      );
    }

    const result = await response.json();

    return {
      inputWithSecretHash: result.string_hash,
      secretHash: result.secret_hash,
    };
  }
}
