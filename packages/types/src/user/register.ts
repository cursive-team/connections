export interface UserRegisterRequest {
  email: string;
  signaturePublicKey: string;
  encryptionPublicKey: string;
  passwordSalt: string;
  passwordHash: string;
}

export interface UserRegisterResponse {
  registrationNumber: number;
}
