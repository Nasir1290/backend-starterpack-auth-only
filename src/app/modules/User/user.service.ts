import bcrypt from "bcrypt";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { User, UserRole, UserStatus } from "@prisma/client";
import { TUser } from "./user.interface";
import httpStatus from "http-status";

const createUser = async (payload: User) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new ApiError(400, "This user information already exists");
  }
  const hashedPassword: string = await bcrypt.hash(payload.password, 12);
  const userData = {
    ...payload,
    password: hashedPassword,
    role: UserRole.USER,
    userStatus: UserStatus.ACTIVE,
  };

  const user = await prisma.user.create({
    data: userData,
  });
  if (!user) {
    throw new ApiError(httpStatus.CONFLICT, "User not created!");
  }

  return user;
};

const getUserById = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: { id },
  });

  return result;
};

const updateUser = async (id: string, payload: any) => {
  const result = await prisma.user.update({
    where: { id },
    data: payload,
  });

  return result;
};

const blockUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "This user not found");
  }

  // Determine the new status
  const newStatus =
    user.userStatus === UserStatus.BLOCKED
      ? UserStatus.ACTIVE
      : UserStatus.BLOCKED;

  const result = await prisma.user.update({
    where: { id },
    data: { userStatus: newStatus },
  });

  return result;
};

const deleteUser = async (id: string) => {
  const result = await prisma.user.update({
    where: { id },
    data: { isDeleted: true },
  });

  return result;
};

const getAllUsers = async () => {
  const result = await prisma.user.findMany({
    where: {
      userStatus: "ACTIVE",
    },
  });
  return result;
};

export const UserService = {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
  blockUser,
};
