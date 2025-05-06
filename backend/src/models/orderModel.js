import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createOrder = async (items, total) => {
  return prisma.order.create({
    data: {
      items: JSON.stringify(items),
      total: parseFloat(total),
    },
  });
};

export const getAllOrders = async () => {
  return prisma.order.findMany();
};