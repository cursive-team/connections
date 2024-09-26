import { PrismaClient } from "@prisma/client";
import {
  BackupCreateRequest,
  AuthTokenCreateRequest,
  UserCreateRequest,
  User,
  UserSchema,
  BackupSchema, Backup
} from "@/lib/controller/postgres/types";
import {AuthToken, AuthTokenSchema} from "@types";
import {v4 as uuidv4} from "uuid";

// Should follow iPostgresClient implementation
export class PrismaPostgresClient {
  prismaClient: PrismaClient

  constructor() {
    this.prismaClient = new PrismaClient();
  }

  async GetUserByEmail (email: string): Promise<User | null> {
    const prismaUser = await this.prismaClient.user.findUnique({
      where: { email },
    });

    if (prismaUser) {
      return UserSchema.parse(prismaUser);
    }

    return null;
  }

  async GetUserById(id: string): Promise<User | null> {
    const prismaUser = await this.prismaClient.user.findUnique({
      where: { id },
    });

    if (prismaUser) {
      return UserSchema.parse(prismaUser);
    }

    return null;
  }

  async CreateUser(createUser: UserCreateRequest): Promise<User> {
    const prismaUser = await this.prismaClient.user.create({
      data: createUser,
    });

    if (prismaUser) {
      return UserSchema.parse(prismaUser);
    }

    return {} as User;
  }

  async CreateBackup(createBackup: BackupCreateRequest): Promise<Backup> {
    const prismaBackup = await this.prismaClient.backup.create({
      data: createBackup,
    });

    if (prismaBackup) {
      return BackupSchema.parse(prismaBackup);
    }

    return {} as Backup;
  }

  async CreateAuthToken(createAuthToken: AuthTokenCreateRequest): Promise<AuthToken> {
    const prismaAuthToken = await this.prismaClient.authToken.create({
      data: createAuthToken,
    });

    if (prismaAuthToken) {
      return AuthTokenSchema.parse(createAuthToken);
    }

    return {} as AuthToken;
  }

  /**
   * Generates an auth token and stores it in the database for a given userId.
   * @param userId The user ID for which to generate and store the auth token.
   * @returns The generated auth token.
   */

  async CreateAuthTokenForUser(userId: string): Promise<AuthToken> {
    const tokenValue = uuidv4();

    // Set default auth token expiry time to 2 weeks from now
    // 14 days, 24 hours, 60 minutes, 60 seconds, 1000 milliseconds
    const twoWeeksInMilliseconds = 14 * 24 * 60 * 60 * 1000;
    const twoWeeksFromNow = new Date(Date.now() + twoWeeksInMilliseconds);

    const user = await this.GetUserById(userId);

    if (!user) {
      throw new Error(`Could not generate auth token for user ${userId}`);
    }

    await this.CreateAuthToken({
      value: tokenValue,
      userId,
      expiresAt: twoWeeksFromNow,
    })

    return { value: tokenValue, expiresAt: twoWeeksFromNow };
  }
}
