import { PrismaPostgresClient } from "@/lib/controller/postgres/prisma/client";
import { SigninToken } from "@/lib/controller/postgres/types";

/**
 * Generates a signin token, stores it in the database, and sends an email with a 6-digit code to the user.
 * @param email The email for which to generate and store the signin token.
 * @returns The generated signin token.
 */
PrismaPostgresClient.prototype.CreateSigninToken = async function (
  email: string
): Promise<SigninToken> {
  // Check if the user has more than 10 signin tokens in the past hour
  const MAX_SIGNIN_ATTEMPTS = 10;
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentSigninTokens = await this.prismaClient.signinToken.count({
    where: {
      email,
      createdAt: {
        gte: oneHourAgo,
      },
    },
  });

  if (recentSigninTokens >= MAX_SIGNIN_ATTEMPTS) {
    throw new Error(
      `Too many signin attempts for email ${email}. Please try again later.`
    );
  }

  // Generate a 6-digit code
  const sixDigitCode = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");

  // Set default signin token expiry time to 15 minutes from now
  const fifteenMinutesInMilliseconds = 15 * 60 * 1000;
  const expiresAt = new Date(Date.now() + fifteenMinutesInMilliseconds);

  // Create the signin token in the database
  const signinToken = await this.prismaClient.signinToken.create({
    data: {
      email,
      value: sixDigitCode,
      expiresAt,
    },
  });

  if (!signinToken) {
    throw new Error(`Could not generate signin token for email ${email}`);
  }

  return {
    id: signinToken.id,
    email: signinToken.email,
    value: signinToken.value,
    isUsed: signinToken.isUsed,
    expiresAt: signinToken.expiresAt,
    createdAt: signinToken.createdAt,
  };
};

/**
 * Verifies a signin token, marks it as used if desired, and returns true if successful.
 * @param email The email for which to verify the signin token.
 * @param signinTokenGuess The 6-digit code to verify.
 * @param useToken Whether to mark the signin token as used.
 * @returns True if the signin token is valid, false otherwise.
 */
PrismaPostgresClient.prototype.VerifySigninToken = async function (
  email: string,
  signinTokenGuess: string,
  useToken: boolean
): Promise<boolean> {
  const prismaSigninToken = await this.prismaClient.signinToken.findFirst({
    where: {
      email,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Check if email has a signin token, throw error if not
  if (!prismaSigninToken) {
    throw new Error(`No signin token found for email ${email}`);
  }

  // Check if signin token has expired, return false if so
  if (prismaSigninToken.expiresAt < new Date()) {
    return false;
  }

  // Check if signin token has been used, return false if so
  if (prismaSigninToken.isUsed) {
    return false;
  }

  // Check if signin token has been used too many times, return false if so
  if (prismaSigninToken.signinAttemptCount >= 3) {
    return false;
  }

  // Check if signin token is incorrect, return false if so
  if (prismaSigninToken.value !== signinTokenGuess) {
    await this.prismaClient.signinToken.update({
      where: { id: prismaSigninToken.id },
      data: { signinAttemptCount: prismaSigninToken.signinAttemptCount + 1 },
    });
    return false;
  }

  // Mark signin token as used
  if (useToken) {
    await this.prismaClient.signinToken.update({
      where: { id: prismaSigninToken.id },
      data: { isUsed: true },
    });
  }

  return true;
};
