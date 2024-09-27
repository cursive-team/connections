import { v4 as uuidv4 } from "uuid";
import { PrismaPostgresClient } from "@/lib/controller/postgres/prisma/client";
import { AuthToken, AuthTokenSchema } from "@types";
import { AuthTokenCreateRequest } from "@/lib/controller/postgres/types";

/**
 * Generates an auth token and stores it in the database for a given userId.
 * @param userId The user ID for which to generate and store the auth token.
 * @returns The generated auth token.
 */

PrismaPostgresClient.prototype.CreateAuthTokenForUser = async function (
  userId: string
): Promise<AuthToken> {
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
  });

  return { value: tokenValue, expiresAt: twoWeeksFromNow };
};

PrismaPostgresClient.prototype.CreateAuthToken = async function (
  createAuthToken: AuthTokenCreateRequest
): Promise<AuthToken> {
  const prismaAuthToken = await this.prismaClient.authToken.create({
    data: createAuthToken,
  });

  if (prismaAuthToken) {
    return AuthTokenSchema.parse(createAuthToken);
  }

  return {} as AuthToken;
};
