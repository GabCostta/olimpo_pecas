import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Nova funcionalidade de pedidos, lógica feita pelo Caio para regristar.
// Verificação do pedido e armazenamento no banco de dados "npx prisma studio" para ver, feito pelo Caio.
router.post("/", async (req, res) => {
    try {
        const { items, total } = req.body;

        if (!items || items.length === 0 || !total) {
            return res.status(400).json({ error: "Carrinho vazio ou total inválido" });
        }

        const newOrder = await prisma.order.create({
            data: {
                items: JSON.stringify(items), // Salva os itens como JSON
                total: parseFloat(total),
            },
        });

        res.status(201).json({ message: "Pedido registrado com sucesso!", order: newOrder });
    } catch (error) {
        console.error("Erro ao registrar pedido:", error);
        res.status(500).json({ error: "Erro interno ao registrar pedido" });
    }
});

// Verificação do pedido e armazenamento no banco de dados "http://localhost:3001/orders", feito pelo Caio.
router.get("/", async (req, res) => {
    try {
        const orders = await prisma.order.findMany();
        res.json(orders); // Retorna os pedidos em formato JSON
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar pedidos" });
    }
});

export default router;