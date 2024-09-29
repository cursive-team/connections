import { PrismaPostgresClient } from "@/lib/controller/postgres/prisma/client";

import {
  User,
  UserSchema,
  UserCreateRequest,
} from "@/lib/controller/postgres/types";

PrismaPostgresClient.prototype.GetUserByEmail = async function (
  email: string
): Promise<User | null> {
  const prismaUser = await this.prismaClient.user.findUnique({
    where: { email },
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
  const prismaUser = await this.prismaClient.user.create({
    data: createUser,
  });

  if (prismaUser) {
    return UserSchema.parse(prismaUser);
  }

  return {} as User;
};
