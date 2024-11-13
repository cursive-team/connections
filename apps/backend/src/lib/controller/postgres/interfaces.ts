import {
  User,
  UserCreateRequest,
  Backup,
  BackupCreateRequest,
  AuthTokenCreateRequest,
  SigninToken,
  CreateDataHash,
  DataHash,
  UpdateDataHash,
  DataHashMatch,
  PairConnection,
} from "@/lib/controller/postgres/types";
import {
  AuthToken,
  BackupData,
  ChipIssuer,
  CreateBackupData,
  CreateMessageData,
  MessageData,
} from "@types";

export interface iPostgresClient {
  HealthCheck(): Promise<boolean>;

  // User methods
  GetUserByUsernameCaseInsensitive(username: string): Promise<User | null>;
  GetUserByEmail(email: string): Promise<User | null>;
  GetUserById(userId: string): Promise<User | null>;
  GetUserByAuthToken(authToken: string): Promise<User | null>;
  GetUserBySigPubKey(sigPubKey: string): Promise<User | null>;
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

  // Message methods
  GetMessagesForUser(
    userSignaturePublicKey: string,
    lastMessageFetchedAt: Date | undefined
  ): Promise<MessageData[]>;
  CreateMessages(messages: CreateMessageData[]): Promise<void>;

  // Data Hash methods
  CreatePrivateDataHashes(dataHashes: CreateDataHash[]): Promise<void>;
  GetUnhashedDataHashes(): Promise<DataHash[]>;
  UpdateDataHashes(dataHashes: UpdateDataHash[]): Promise<void>;
  GetAllUserHashesByChipAndLocation(
    chipIssuer: ChipIssuer,
    locationId: string
  ): Promise<Record<string, string[]>>;
  CreateDataHashMatch(
    usernameA: string,
    usernameB: string,
    connectionScore: number,
    notificationUsernameA: string | undefined,
    notificationUsernameB: string | undefined
  ): Promise<void>;
  GetAllDataHashMatches(): Promise<DataHashMatch[]>;
  UpdatePairConnection(username: string): Promise<void>;
  GetLatestPairConnection(): Promise<PairConnection | null>;
}
