import { PrismaPostgresClient } from "@/lib/controller/postgres/prisma/client";
import { iPostgresClient } from "@/lib/controller/postgres/interfaces";
import {
  User,
  UserCreateRequest,
  Backup,
  BackupCreateRequest,
  AuthTokenCreateRequest,
  SigninToken,
} from "@/lib/controller/postgres/types";
import {
  AuthToken,
  BackupData,
  ChipIssuer,
  ChipTapResponse,
  CreateBackupData,
  RegisterChipRequest,
  TapParams,
  UpdateChipRequest,
  LeaderboardEntry,
} from "@types";
import { Chip } from "@/lib/controller/chip/types";
import { iChipClient } from "@/lib/controller/chip/interfaces";
import { ManagedChipClient } from "@/lib/controller/chip/managed/client";
import { SESEmailClient } from "@/lib/controller/email/ses/client";
import { iEmailClient } from "@/lib/controller/email/interfaces";

export class Controller {
  postgresClient: iPostgresClient; // Use interface so that it can be mocked out
  chipClient: iChipClient;
  emailClient: iEmailClient;

  constructor() {
    // Default client, could also pass through mock
    this.postgresClient = new PrismaPostgresClient();

    this.chipClient = new ManagedChipClient();

    // Email client with AWS Simple Email Service
    this.emailClient = new SESEmailClient();

    // Over time more clients will be added (e.g. nitro enclave client)...
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

  RegisterChip(registerChip: RegisterChipRequest): Promise<Chip> {
    return this.chipClient.RegisterChip(registerChip);
  }

  UpdateChip(updateChip: UpdateChipRequest): Promise<Chip> {
    return this.chipClient.UpdateChip(updateChip);
  }

  GetTapFromChip(tapParams: TapParams): Promise<ChipTapResponse> {
    return this.chipClient.GetTapFromChip(tapParams);
  }

  GetLeaderboardEntry(
    username: string,
    chipIssuer: ChipIssuer
  ): Promise<LeaderboardEntry | null> {
    return this.chipClient.GetLeaderboardEntry(username, chipIssuer);
  }

  UpdateLeaderboardEntry(
    username: string,
    chipIssuer: ChipIssuer
  ): Promise<void> {
    return this.chipClient.UpdateLeaderboardEntry(username, chipIssuer);
  }

  GetLeaderboardTotalTaps(
    chipIssuer: ChipIssuer
  ): Promise<number | null> {
    return this.chipClient.GetLeaderboardTotalTaps(chipIssuer);
  }

  GetLeaderboardTotalContributors(
    chipIssuer: ChipIssuer
  ): Promise<number | null> {
    return this.chipClient.GetLeaderboardTotalContributors(chipIssuer);
  }

  GetUserLeaderboardPosition(
    username: string,
    chipIssuer: ChipIssuer
  ): Promise<number | null> {
    return this.chipClient.GetUserLeaderboardPosition(username, chipIssuer)
  }

  GetTopLeaderboard(
    count: number,
    chipIssuer: ChipIssuer
  ): Promise<LeaderboardEntry[] | null> {
    return this.chipClient.GetTopLeaderboard(count, chipIssuer)
  }

  EmailSigninToken(signinToken: SigninToken): Promise<void> {
    return this.emailClient.EmailSigninToken(signinToken);
  }
}
