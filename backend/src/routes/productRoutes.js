import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Criar um novo produto, feito pelo Nicolas.
router.post("/", async (req, res) => {
    try {
        const { name, descricao, preco } = req.body;
        const novoProduto = await prisma.produto.create({
            data: { name, descricao, preco },
        });
        res.json(novoProduto);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar o produto" });
    }
});

// Listar todos os produtos
router.get("/", async (req, res) => {
    const produtos = await prisma.produto.findMany();
    res.json(produtos);
});

// Atualizar um produto pelo ID
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, descricao, preco } = req.body;
        const produtoAtualizado = await prisma.produto.update({
            where: { id: parseInt(id) },
            data: { name, descricao, preco },
        });
        res.json(produtoAtualizado);
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar o produto" });
    }
});

// Deletar um produto pelo ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.produto.delete({ where: { id: parseInt(id) } });
        res.json({ message: "Produto removido com sucesso" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar o produto" });
    }
});

export default router;