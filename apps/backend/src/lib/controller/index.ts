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
  ChipTapResponse,
  CreateBackupData,
  RegisterChipRequest,
  TapParams,
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

  GetTapFromChip(tapParams: TapParams): Promise<ChipTapResponse> {
    return this.chipClient.GetTapFromChip(tapParams);
  }

  EmailSigninToken(signinToken: SigninToken): Promise<void> {
    return this.emailClient.EmailSigninToken(signinToken);
  }
}
