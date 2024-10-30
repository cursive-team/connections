import { iPostgresClient } from "@/lib/controller/postgres/interfaces";
import { PrismaClient } from "@prisma/client";
import {
  BackupCreateRequest,
  AuthTokenCreateRequest,
  UserCreateRequest,
  User,
  Backup,
  SigninToken,
} from "@/lib/controller/postgres/types";
import {
  AuthToken,
  BackupData,
  CreateBackupData,
  CreateMessageData,
  MessageData,
} from "@types";

// NOTE: Hoist all prototype methods -- if you do not import the method file, the method(s) will evaluate to undefined at runtime
import("@/lib/controller/postgres/prisma/user/user");
import("@/lib/controller/postgres/prisma/backup/backup");
import("@/lib/controller/postgres/prisma/auth/authToken");
import("@/lib/controller/postgres/prisma/auth/signinToken");
import("@/lib/controller/postgres/prisma/message/message");
import("@/lib/controller/postgres/prisma/dataHash/index");

// Should follow iPostgresClient implementation
export class PrismaPostgresClient implements iPostgresClient {
  prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = new PrismaClient();
  }

  // @ts-expect-error (ts2391: function implementation does not immediately follow declaration)
  HealthCheck(): Promise<boolean>;

  // @ts-expect-error (ts2391)
  GetUserByUsernameCaseInsensitive(username: string): Promise<User | null>;

  // @ts-expect-error (ts2391)
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
  ): Promise<BackupData[]>;

  // @ts-expect-error (ts2391)
  CreateSigninToken(email: string): Promise<SigninToken>;

  // @ts-expect-error (ts2391)
  VerifySigninToken(
    email: string,
    signinTokenGuess: string,
    useToken: boolean
  ): Promise<boolean>;

  // @ts-expect-error (ts2391)
  CreateAuthToken(createAuthToken: AuthTokenCreateRequest): Promise<AuthToken>;

  // @ts-expect-error (ts2391)
  CreateAuthTokenForUser(userId: string): Promise<AuthToken>;

  // @ts-expect-error (ts2391)
  GetMessagesForUser(
    userSignaturePublicKey: string,
    lastMessageFetchedAt: Date | undefined
  ): Promise<MessageData[]>;

  // @ts-expect-error (ts2391)
  CreateMessages(messages: CreateMessageData[]): Promise<void>;

  // @ts-expect-error (ts2391)
  CreatePrivateDataHashes(dataHashes: CreateDataHash[]): Promise<void>;

  // @ts-expect-error (ts2391)
  GetUnhashedDataHashes(): Promise<DataHash[]>;

  // @ts-expect-error (ts2391)
  UpdateDataHashes(dataHashes: UpdateDataHash[]): Promise<void>;
}
