import {
  User,
  UserCreateRequest,
  Backup,
  BackupCreateRequest,
  AuthTokenCreateRequest,
} from "@/lib/controller/postgres/types";
import { AuthToken } from "@local-shared/types";

export interface iPostgresClient {
  // User methods
  GetUserByEmail(email: string): Promise<User | null>;
  GetUserById(userId: string): Promise<User | null>;
  CreateUser(createUser: UserCreateRequest): Promise<User>;

  // Backup methods
  GetAllBackupsForUser(userId: string): Promise<Backup[]>;
  CreateBackup(createBackup: BackupCreateRequest): Promise<Backup>;

  // AuthToken methods
  CreateAuthToken(createAuthToken: AuthTokenCreateRequest): Promise<AuthToken>;
  CreateAuthTokenForUser(userId: string): Promise<AuthToken>;
}
