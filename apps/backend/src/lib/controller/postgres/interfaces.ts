import {
  User,
  UserCreateRequest,
  Backup,
  BackupCreateRequest,
  AuthTokenCreateRequest,
} from "@/lib/controller/postgres/types";
<<<<<<< HEAD
import { AuthToken, BackupData, CreateBackupData } from "@types";
=======
import { AuthToken, CreateBackupData } from "@types";
>>>>>>> 3229d1d (backend handler for updating backup data)

export interface iPostgresClient {
  // User methods
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
<<<<<<< HEAD
  ): Promise<BackupData[]>;
=======
  ): Promise<Date>;
>>>>>>> 3229d1d (backend handler for updating backup data)

  // AuthToken methods
  CreateAuthToken(createAuthToken: AuthTokenCreateRequest): Promise<AuthToken>;
  CreateAuthTokenForUser(userId: string): Promise<AuthToken>;
}
