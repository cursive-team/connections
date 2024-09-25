import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/prisma/client";
import { AuthToken } from "@types";

/**
 * Generates an auth token and stores it in the database for a given userId.
 * @param userId The user ID for which to generate and store the auth token.
 * @returns The generated auth token.
 */
export const generateAuthToken = async (userId: string): Promise<AuthToken> => {
  const tokenValue = uuidv4();

  // Set default auth token expiry time to 2 weeks from now
  // 14 days, 24 hours, 60 minutes, 60 seconds, 1000 milliseconds
  const twoWeeksInMilliseconds = 14 * 24 * 60 * 60 * 1000;
  const twoWeeksFromNow = new Date(Date.now() + twoWeeksInMilliseconds);

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error(`Could not generate auth token for user ${userId}`);
  }

  await prisma.authToken.create({
    data: {
      value: tokenValue,
      userId,
      expiresAt: twoWeeksFromNow,
    },
  });

  return { value: tokenValue, expiresAt: twoWeeksFromNow };
};

/**
 * Verifies that an auth token is valid, and returns the user ID associated with it.
 * @param token - The auth token to verify.
 * @returns The user ID associated with the auth token, or undefined if the token is invalid.
 */
export const verifyAuthToken = async (
  token: string
): Promise<string | undefined> => {
  const tokenEntry = await prisma.authToken.findUnique({
    where: { value: token },
  });

  if (!tokenEntry) {
    return undefined;
  }

  if (tokenEntry.expiresAt < new Date()) {
    return undefined;
  }

  if (tokenEntry.revokedAt !== null && tokenEntry.revokedAt < new Date()) {
    return undefined;
  }

  return tokenEntry.userId;
};
