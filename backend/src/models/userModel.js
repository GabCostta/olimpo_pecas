import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default {
  async createUser({ nome, email, senha, papel }) {
    return await prisma.user.create({
      data: { nome, email, senha, papel },
    });
  },

  async getAllUsers() {
    return await prisma.user.findMany();
  },

  async getUserById(id) {
    return await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
  },

  async updateUser(id, { nome, email, senha, papel }) {
    return await prisma.user.update({
      where: { id: parseInt(id) },
      data: { nome, email, senha, papel },
    });
  },

  async deleteUser(id) {
    return await prisma.user.delete({
      where: { id: parseInt(id) },
    });
  },
};