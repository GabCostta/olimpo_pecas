import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default {
  async addItem({ userId, produtoId, quantidade }) {
    return await prisma.cart.create({
      data: { userId, produtoId, quantidade },
    });
  },

  async getUserCart(userId) {
    return await prisma.cart.findMany({
      where: { userId: Number(userId) },
    });
  },

  async updateItemQuantity(id, quantidade) {
    return await prisma.cart.update({
      where: { id: parseInt(id) },
      data: { quantidade },
    });
  },

  async removeItem(id) {
    return await prisma.cart.delete({
      where: { id: parseInt(id) },
    });
  },
};