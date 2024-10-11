import { PrismaPostgresClient } from "@/lib/controller/postgres/prisma/client";

import {
  User,
  UserSchema,
  UserCreateRequest,
} from "@/lib/controller/postgres/types";

PrismaPostgresClient.prototype.HealthCheck =
  async function (): Promise<boolean> {
    try {
      await this.prismaClient.$queryRaw`SELECT 1`;
      console.log("Database connection successful");
      return true;
    } catch (error) {
      console.error("Database connection failed:", error);
    } finally {
      await this.prismaClient.$disconnect();
    }

    return false;
  };

PrismaPostgresClient.prototype.GetUserByUsernameCaseInsensitive =
  async function (username: string): Promise<User | null> {
    const prismaUser = await this.prismaClient.user.findUnique({
      where: { usernameLowercase: username.toLowerCase() },
    });

    if (prismaUser) {
      return UserSchema.parse(prismaUser);
    }

    return null;
  };

PrismaPostgresClient.prototype.GetUserByEmail = async function (
  email: string
): Promise<User | null> {
  const prismaUser = await this.prismaClient.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (prismaUser) {
    return UserSchema.parse(prismaUser);
  }

  return null;
};

PrismaPostgresClient.prototype.GetUserById = async function (
  userId: string
): Promise<User | null> {
  const prismaUser = await this.prismaClient.user.findUnique({
    where: { id: userId },
  });

  if (prismaUser) {
    return UserSchema.parse(prismaUser);
  }

  return null;
};

PrismaPostgresClient.prototype.GetUserByAuthToken = async function (
  authToken: string
): Promise<User | null> {
  const prismaAuthToken = await this.prismaClient.authToken.findUnique({
    where: { value: authToken },
  });

  if (!prismaAuthToken) {
    return null;
  }

  const currentTime = new Date();
  if (prismaAuthToken.revokedAt && prismaAuthToken.revokedAt <= currentTime) {
    return null;
  }
  if (prismaAuthToken.expiresAt <= currentTime) {
    return null;
  }

  const prismaUser = await this.prismaClient.user.findUnique({
    where: { id: prismaAuthToken.userId },
  });

  if (prismaUser) {
    return UserSchema.parse(prismaUser);
  }

  return null;
};

PrismaPostgresClient.prototype.CreateUser = async function (
  createUser: UserCreateRequest
): Promise<User> {
  // Create the user with the lowercase username and email
  const prismaUser = await this.prismaClient.user.create({
    data: {
      ...createUser,
      usernameLowercase: createUser.username.toLowerCase(),
      email: createUser.email.toLowerCase(),
    },
  });

  if (prismaUser) {
    return UserSchema.parse(prismaUser);
  }

  return {} as User;
};
