import { PrismaPostgresClient } from "@/lib/controller/postgres/prisma/client";
import { iPostgresClient } from "@/lib/controller/postgres/interfaces";
import {
  User,
  UserCreateRequest,
  Backup,
  BackupCreateRequest,
  AuthTokenCreateRequest,
} from "@/lib/controller/postgres/types";
import {
  AuthToken,
<<<<<<< HEAD
  BackupData,
  ChipTapResponse,
  CreateBackupData,
<<<<<<< HEAD
=======
  ChipTapResponse,
>>>>>>> 0d1ba92 (backend implementation of chip registration and tapping)
=======
>>>>>>> 3229d1d (backend handler for updating backup data)
  RegisterChipRequest,
  TapParams,
} from "@types";
import { Chip } from "@/lib/controller/chip/types";
import { iChipClient } from "@/lib/controller/chip/interfaces";
import { ManagedChipClient } from "@/lib/controller/chip/managed/client";

export class Controller {
  postgresClient: iPostgresClient; // Use interface so that it can be mocked out
  chipClient: iChipClient;

  constructor() {
    // Default client, could also pass through mock
    this.postgresClient = new PrismaPostgresClient();

    this.chipClient = new ManagedChipClient();

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

<<<<<<< HEAD
  AppendBackupData(
    userId: string,
    backupData: CreateBackupData[]
  ): Promise<BackupData[]> {
=======
  // Returns the date the new backup data entries were submitted at
  AppendBackupData(
    userId: string,
    backupData: CreateBackupData[]
  ): Promise<Date> {
>>>>>>> 3229d1d (backend handler for updating backup data)
    return this.postgresClient.AppendBackupData(userId, backupData);
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
}
