import {
  User,
  UserCreateRequest,
  Backup,
  BackupCreateRequest,
  AuthTokenCreateRequest,
  SigninToken,
} from "@/lib/controller/postgres/types";
import { AuthToken, BackupData, CreateBackupData } from "@types";

export interface iPostgresClient {
  // User methods
  GetUserByUsernameCaseInsensitive(username: string): Promise<User | null>;
  GetUserByEmail(email: string): Promise<User | null>;
  GetUserById(userId: string): Promise<User | null>;
  GetUserByAuthToken(authToken: string): Promise<User | null>;
  CreateUser(createUser: UserCreateRequest): Promise<User>;

  // Backup methods
  GetAllBackupsForUser(userId: string): Promise<Backup[]>;
  GetBackupDataAfter(userId: string, submittedAt: Date): Promise<Backup[]>;
  CreateBackup(createBackup: BackupCreateRequest): Promise<Backup>;
  AppendBackupData(
    userId: string,
    backupData: CreateBackupData[]
  ): Promise<BackupData[]>;

  // SigninToken methods
  CreateSigninToken(email: string): Promise<SigninToken>;
  VerifySigninToken(
    email: string,
    signinTokenGuess: string,
    useToken: boolean
  ): Promise<boolean>;

  // AuthToken methods
  CreateAuthToken(createAuthToken: AuthTokenCreateRequest): Promise<AuthToken>;
  CreateAuthTokenForUser(userId: string): Promise<AuthToken>;
}
