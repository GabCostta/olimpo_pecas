// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Rota de registro (registrar)
app.post("/registrar", async (req, res) => {
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
