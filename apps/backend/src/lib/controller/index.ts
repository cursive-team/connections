import { PrismaPostgresClient } from "@/lib/controller/postgres/prisma/client";
import { iPostgresClient } from "@/lib/controller/postgres/interfaces";
import {
  User,
  UserCreateRequest,
  Backup,
  BackupCreateRequest,
  AuthTokenCreateRequest,
} from "@/lib/controller/postgres/types";
import { AuthToken } from "@types";

export class Controller {
  postgresClient: iPostgresClient; // Use interface so that it can be mocked out

  constructor() {
    // Default client, could also pass through mock
    this.postgresClient = new PrismaPostgresClient();

    // Over time more clients will be added (e.g. nitro enclave client)...
  }

  GetUserByEmail(email: string): Promise<User | null> {
    return this.postgresClient.GetUserByEmail(email);
  }

  GetUserById(userId: string): Promise<User | null> {
    return this.postgresClient.GetUserById(userId);
  }

  CreateUser(createUser: UserCreateRequest): Promise<User> {
    return this.postgresClient.CreateUser(createUser);
  }

  GetAllBackupsForUser(userId: string): Promise<Backup[]> {
    return this.postgresClient.GetAllBackupsForUser(userId);
  }

  CreateBackup(createBackup: BackupCreateRequest): Promise<Backup> {
    return this.postgresClient.CreateBackup(createBackup);
  }

  CreateAuthToken(createAuthToken: AuthTokenCreateRequest): Promise<AuthToken> {
    return this.postgresClient.CreateAuthToken(createAuthToken);
  }

  CreateAuthTokenForUser(userId: string): Promise<AuthToken> {
    return this.postgresClient.CreateAuthTokenForUser(userId);
  }
}
