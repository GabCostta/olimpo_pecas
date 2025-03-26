import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default {
  async createProduct({ name, descricao, preco }) {
    return await prisma.produto.create({
      data: { name, descricao, preco },
    });
  },

  async getAllProducts() {
    return await prisma.produto.findMany();
  },

  async updateProduct(id, { name, descricao, preco }) {
    return await prisma.produto.update({
      where: { id: parseInt(id) },
      data: { name, descricao, preco },
    });
  },

  async deleteProduct(id) {
    return await prisma.produto.delete({
      where: { id: parseInt(id) },
    });
  },
};