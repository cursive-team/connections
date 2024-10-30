export interface iEnclaveClient {
  GetAttestationDoc(): Promise<string>;
  HashWithSecret(encryptedInput: string): Promise<{
    inputWithSecretHash: string;
    secretHash: string;
  }>;
}
