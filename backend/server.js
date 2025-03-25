// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import userRoutes from "./src/routes/userRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";

dotenv.config();

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use("/users", userRoutes);
app.use("/produtos", productRoutes);
app.use("/carrinho", cartRoutes);
app.use("/orders", orderRoutes); // Rota de pedidos

app.get("/", (req, res) => {
    res.send("Servidor está rodando corretamente!");
});

app.post("/create-user", async (req, res) => {
    const { email, nome } = req.body;

    try {
        // Verificar se o usuário já existe
        const usuarioExistente = await prisma.user.findUnique({
            where: { email },
        });

        if (usuarioExistente) {
            return res.status(400).json({ mensagem: "Email já registrado." });
        }

        // Criar o novo usuário no banco de dados
        const novoUsuario = await prisma.user.create({
            data: {
                email,
                nome,
            },
        });

        // Enviar resposta de sucesso
        res.status(201).json({
            mensagem: "Conta criada com sucesso!",
            token: process.env.TOKEN, // Usar o token do arquivo .env
        });
    } catch (error) {
        console.error("Erro ao criar o usuário:", error);
        res.status(500).json({ mensagem: "Erro ao criar a conta." });
    }
});

// Resto do código do servidor...
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
