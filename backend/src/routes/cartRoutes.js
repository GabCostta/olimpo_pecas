import express from "express";
 import { PrismaClient } from "@prisma/client";
 
 const router = express.Router();
 const prisma = new PrismaClient();
 
 // Adicionar um produto ao carrinho, feito pelo Nicolas.
 router.post("/", async (req, res) => {
   try {
     const { userId, produtoId, quantidade } = req.body;
     const novoItem = await prisma.cart.create({
       data: { userId, produtoId, quantidade },
     });
     res.json(novoItem);
   } catch (error) {
     res.status(500).json({ error: "Erro ao adicionar item ao carrinho" });
   }
 });
 
 // Listar os itens do carrinho de um usuário
 router.get("/:userId", async (req, res) => {
   try {
     const { userId } = req.params;
     const carrinho = await prisma.cart.findMany({
       where: { userId: parseInt(userId) },
       include: { produto: true },
     });
     res.json(carrinho);
   } catch (error) {
     res.status(500).json({ error: "Erro ao buscar o carrinho" });
   }
 });
 
 // Atualizar a quantidade de um item no carrinho
 router.put("/:id", async (req, res) => {
   try {
     const { id } = req.params;
     const { quantidade } = req.body;
     const itemAtualizado = await prisma.cart.update({
       where: { id: parseInt(id) },
       data: { quantidade },
     });
     res.json(itemAtualizado);
   } catch (error) {
     res.status(500).json({ error: "Erro ao atualizar item do carrinho" });
   }
 });
 
 // Remover um item do carrinho
 router.delete("/:id", async (req, res) => {
   try {
     const { id } = req.params;
     await prisma.cart.delete({ where: { id: parseInt(id) } });
     res.json({ message: "Item removido do carrinho" });
   } catch (error) {
     res.status(500).json({ error: "Erro ao remover item do carrinho" });
   }
 });
 
 export default router;
