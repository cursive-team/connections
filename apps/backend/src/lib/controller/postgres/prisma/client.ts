import { iPostgresClient } from "@/lib/controller/postgres/interfaces";
import { PrismaClient } from "@prisma/client";
import {
  BackupCreateRequest,
  AuthTokenCreateRequest,
  UserCreateRequest,
  User,
  Backup,
} from "@/lib/controller/postgres/types";
<<<<<<< HEAD
import { AuthToken, BackupData, CreateBackupData } from "@types";
=======
import { AuthToken, CreateBackupData } from "@types";
>>>>>>> 3229d1d (backend handler for updating backup data)

// NOTE: Hoist all prototype methods -- if you do not import the method file, the method(s) will evaluate to undefined at runtime
import("@/lib/controller/postgres/prisma/user/user");
import("@/lib/controller/postgres/prisma/backup/backup");
import("@/lib/controller/postgres/prisma/auth/token");

// Should follow iPostgresClient implementation
export class PrismaPostgresClient implements iPostgresClient {
  prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = new PrismaClient();
  }

  // @ts-expect-error (ts2391: function implementation does not immediately follow declaration)
  GetUserByEmail(email: string): Promise<User | null>;

  // @ts-expect-error (ts2391)
  GetUserById(userId: string): Promise<User | null>;

  // @ts-expect-error (ts2391)
  GetUserByAuthToken(authToken: string): Promise<User | null>;

  // @ts-expect-error (ts2391)
  CreateUser(createUser: UserCreateRequest): Promise<User>;

  // @ts-expect-error (ts2391)
  GetAllBackupsForUser(userId: string): Promise<Backup[]>;

  // @ts-expect-error (ts2391)
  GetBackupDataAfter(userId: string, submittedAt: Date): Promise<Backup[]>;

  // @ts-expect-error (ts2391)
  CreateBackup(createBackup: BackupCreateRequest): Promise<Backup>;

  // @ts-expect-error (ts2391)
  AppendBackupData(
    userId: string,
    backupData: CreateBackupData[]
<<<<<<< HEAD
  ): Promise<BackupData[]>;
=======
  ): Promise<Date>;
>>>>>>> 3229d1d (backend handler for updating backup data)

  // @ts-expect-error (ts2391)
  CreateAuthToken(createAuthToken: AuthTokenCreateRequest): Promise<AuthToken>;

  // @ts-expect-error (ts2391)
  CreateAuthTokenForUser(userId: string): Promise<AuthToken>;
}
