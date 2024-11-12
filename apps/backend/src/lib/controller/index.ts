import { PrismaPostgresClient } from "@/lib/controller/postgres/prisma/client";
import { iPostgresClient } from "@/lib/controller/postgres/interfaces";
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
  ChipTapResponse,
  CreateBackupData,
  CreateMessageData,
  MessageData,
  RegisterChipRequest,
  TapParams,
  UpdateChipRequest,
  LeaderboardEntry,
  LeaderboardEntryType,
  AccessToken,
  DataImportSource,
  GraphEdgeResponse,
  ErrorResponse,
} from "@types";
import { Chip } from "@/lib/controller/chip/types";
import { TwitterReclaimController } from "@/lib/controller/reclaim/twitter";
import { iChipClient } from "@/lib/controller/chip/interfaces";
import { ManagedChipClient } from "@/lib/controller/chip/managed/client";
import { SESEmailClient } from "@/lib/controller/email/ses/client";
import { iEmailClient } from "@/lib/controller/email/interfaces";
import { iOAuthClient } from "@/lib/controller/oauth/interfaces";
import { BespokeOAuthClient } from "@/lib/controller/oauth/bespoke/client";
import { TelegramNotificationClient } from "./notification/telegram/client";
import { iNotificationClient } from "./notification/interfaces";
import { NitroEnclaveClient } from "@/lib/controller/enclave/nitro/client";
import { iEnclaveClient } from "@/lib/controller/enclave/interfaces";
import { iGraphClient } from "@/lib/controller/graph/interfaces";
import { PrismaGraphClient } from "@/lib/controller/graph/prisma/client";
import { EdgeData } from "@/lib/controller/graph/types";
import { TwitterReclaimCallbackResponse } from "./reclaim/interface";
import { TwitterReclaimUrlResponse } from "./reclaim/interface";

export class Controller {
  postgresClient: iPostgresClient; // Use interface so that it can be mocked out
  chipClient: iChipClient;
  emailClient: iEmailClient;
  oauthClient: iOAuthClient;
  notificationClient: iNotificationClient;
  enclaveClient: iEnclaveClient;
  graphClient: iGraphClient;
  reclaimTwitterClient: TwitterReclaimController;

  constructor() {
    // Default client, could also pass through mock
    this.postgresClient = new PrismaPostgresClient();

    this.chipClient = new ManagedChipClient();

    // Email client with AWS Simple Email Service
    this.emailClient = new SESEmailClient();

    // Bespoke OAuth client -- in theory could change out for mature OAuth library, if we have the need and a good candidate
    this.oauthClient = new BespokeOAuthClient();

    // Notification client, currently only Telegram
    this.notificationClient = new TelegramNotificationClient();

    // Enclave client with AWS Nitro Enclave
    this.enclaveClient = new NitroEnclaveClient();

    // Graph client -- uses primsa but in the future may use graph DB of some sort...
    this.graphClient = new PrismaGraphClient();

    // Initialize Twitter Reclaim client
    this.reclaimTwitterClient = new TwitterReclaimController();

  }

  NotificationInitialize(): Promise<void> {
    return this.notificationClient.Initialize();
  }

  SendNotification(userId: string, message: string): Promise<boolean> {
    return this.notificationClient.SendNotification(userId, message);
  }

  PostgresHealthCheck(): Promise<boolean> {
    return this.postgresClient.HealthCheck();
  }

  GetUserByUsernameCaseInsensitive(username: string): Promise<User | null> {
    return this.postgresClient.GetUserByUsernameCaseInsensitive(username);
  }

  GetUserByEmail(email: string): Promise<User | null> {
    return this.postgresClient.GetUserByEmail(email);
  }

  GetUserById(userId: string): Promise<User | null> {
    return this.postgresClient.GetUserById(userId);
  }

  GetUserByAuthToken(authToken: string): Promise<User | null> {
    return this.postgresClient.GetUserByAuthToken(authToken);
  }

  CreateUser(createUser: UserCreateRequest): Promise<User> {
    return this.postgresClient.CreateUser(createUser);
  }

  GetAllBackupsForUser(userId: string): Promise<Backup[]> {
    return this.postgresClient.GetAllBackupsForUser(userId);
  }

  GetBackupDataAfter(userId: string, submittedAt: Date): Promise<Backup[]> {
    return this.postgresClient.GetBackupDataAfter(userId, submittedAt);
  }

  CreateBackup(createBackup: BackupCreateRequest): Promise<Backup> {
    return this.postgresClient.CreateBackup(createBackup);
  }

  AppendBackupData(
    userId: string,
    backupData: CreateBackupData[]
  ): Promise<BackupData[]> {
    return this.postgresClient.AppendBackupData(userId, backupData);
  }

  CreateSigninToken(email: string): Promise<SigninToken> {
    return this.postgresClient.CreateSigninToken(email);
  }

  VerifySigninToken(
    email: string,
    signinTokenGuess: string,
    useToken: boolean
  ): Promise<boolean> {
    return this.postgresClient.VerifySigninToken(
      email,
      signinTokenGuess,
      useToken
    );
  }

  CreateAuthToken(createAuthToken: AuthTokenCreateRequest): Promise<AuthToken> {
    return this.postgresClient.CreateAuthToken(createAuthToken);
  }

  CreateAuthTokenForUser(userId: string): Promise<AuthToken> {
    return this.postgresClient.CreateAuthTokenForUser(userId);
  }

  GetMessagesForUser(
    userSignaturePublicKey: string,
    lastMessageFetchedAt: Date | undefined
  ): Promise<MessageData[]> {
    return this.postgresClient.GetMessagesForUser(
      userSignaturePublicKey,
      lastMessageFetchedAt
    );
  }

  CreateMessages(messages: CreateMessageData[]): Promise<void> {
    return this.postgresClient.CreateMessages(messages);
  }

  RegisterChip(registerChip: RegisterChipRequest): Promise<Chip> {
    return this.chipClient.RegisterChip(registerChip);
  }

  UpdateChip(updateChip: UpdateChipRequest): Promise<Chip> {
    return this.chipClient.UpdateChip(updateChip);
  }

  GetTapFromChip(tapParams: TapParams): Promise<ChipTapResponse> {
    return this.chipClient.GetTapFromChip(tapParams);
  }

  UpdateLeaderboardEntry(
    username: string,
    chipIssuer: ChipIssuer,
    entryType: LeaderboardEntryType,
    entryValue: number
  ): Promise<void> {
    return this.chipClient.UpdateLeaderboardEntry(
      username,
      chipIssuer,
      entryType,
      entryValue
    );
  }

  GetLeaderboardTotalValue(
    chipIssuer: ChipIssuer,
    entryType: LeaderboardEntryType
  ): Promise<number | null> {
    return this.chipClient.GetLeaderboardTotalValue(chipIssuer, entryType);
  }

  GetLeaderboardTotalContributors(
    chipIssuer: ChipIssuer,
    entryType: LeaderboardEntryType
  ): Promise<number | null> {
    return this.chipClient.GetLeaderboardTotalContributors(
      chipIssuer,
      entryType
    );
  }

  GetUserLeaderboardPosition(
    username: string,
    chipIssuer: ChipIssuer,
    entryType: LeaderboardEntryType
  ): Promise<number | null> {
    return this.chipClient.GetUserLeaderboardPosition(
      username,
      chipIssuer,
      entryType
    );
  }

  GetTopLeaderboardEntries(
    chipIssuer: ChipIssuer,
    entryType: LeaderboardEntryType,
    count: number | undefined
  ): Promise<LeaderboardEntry[] | null> {
    return this.chipClient.GetTopLeaderboardEntries(
      chipIssuer,
      entryType,
      count
    );
  }

  EmailSigninToken(signinToken: SigninToken): Promise<void> {
    return this.emailClient.EmailSigninToken(signinToken);
  }

  // Data Hash
  CreatePrivateDataHashes(dataHashes: CreateDataHash[]): Promise<void> {
    return this.postgresClient.CreatePrivateDataHashes(dataHashes);
  }

  GetUnhashedDataHashes(): Promise<DataHash[]> {
    return this.postgresClient.GetUnhashedDataHashes();
  }

  UpdateDataHashes(dataHashes: UpdateDataHash[]): Promise<void> {
    return this.postgresClient.UpdateDataHashes(dataHashes);
  }

  GetAllUserHashesByChipAndLocation(
    chipIssuer: ChipIssuer,
    locationId: string
  ): Promise<Record<string, string[]>> {
    return this.postgresClient.GetAllUserHashesByChipAndLocation(
      chipIssuer,
      locationId
    );
  }

  CreateDataHashMatch(
    usernameA: string,
    usernameB: string,
    connectionScore: number,
    notificationUsernameA: string | undefined,
    notificationUsernameB: string | undefined
  ): Promise<void> {
    return this.postgresClient.CreateDataHashMatch(
      usernameA,
      usernameB,
      connectionScore,
      notificationUsernameA,
      notificationUsernameB
    );
  }

  GetAllDataHashMatches(): Promise<DataHashMatch[]> {
    return this.postgresClient.GetAllDataHashMatches();
  }

  UpdatePairConnection(username: string): Promise<void> {
    return this.postgresClient.UpdatePairConnection(username);
  }

  GetLatestPairConnection(): Promise<PairConnection | null> {
    return this.postgresClient.GetLatestPairConnection();
  }

  // OAuth
  MintOAuthToken(
    app: DataImportSource,
    code: string
  ): Promise<AccessToken | null> {
    return this.oauthClient.MintOAuthToken(app, code);
  }

  // Enclave
  GetAttestationDoc(): Promise<string> {
    return this.enclaveClient.GetAttestationDoc();
  }

  HashWithSecret(encryptedInput: string): Promise<{
    inputWithSecretHash: string;
    secretHash: string;
  }> {
    return this.enclaveClient.HashWithSecret(encryptedInput);
  }

  // Graph
  UpsertGraphEdge(
    id: string | null,
    tapSenderId: string | null,
    tapReceiverId: string | null
  ): Promise<string | ErrorResponse> {
    return this.graphClient.UpsertGraphEdge(id, tapSenderId, tapReceiverId);
  }

  GetGraphEdges(
    fetchUpdatedAtAfter: Date | null
  ): Promise<GraphEdgeResponse | ErrorResponse> {
    return this.graphClient.GetGraphEdges(fetchUpdatedAtAfter);
  }

  SubmitProofJob(username: string, jobId: string): Promise<void> {
    return this.chipClient.SubmitProofJob(username, jobId);
  }

  PollProofResults(): Promise<void> {
    return this.chipClient.PollProofResults();
  }

  // Twitter Reclaim methods
  async GetTwitterReclaimUrl(userId: string, redirectUrl: string): Promise<TwitterReclaimUrlResponse> {
    return this.reclaimTwitterClient.getTwitterReclaimUrl(userId, redirectUrl);
  }

  async HandleTwitterReclaimCallback(proof: string): Promise<TwitterReclaimCallbackResponse> {
    return this.reclaimTwitterClient.handleCallback(proof);
  }
}
