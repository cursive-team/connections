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
