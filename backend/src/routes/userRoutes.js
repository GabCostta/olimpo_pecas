import express from "express";
import userController from "../controllers/userController.js";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { authMiddleware } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/", userController.createUser);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
const prisma = new PrismaClient();

//Cria rota protegida no backend
router.get("/profile", authMiddleware, async (req, res) => {
    res.json({ user: req.user });
  });

// Criar um novo usuário (Cliente ou Vendedor), feito pelo Nicolas.
router.post("/", async (req, res) => {
    try {
        const { nome, email, senha, papel } = req.body;

        // Hash da senha para segurança
        const senhaHash = await bcrypt.hash(senha, 10);

        const novoUsuario = await prisma.user.create({
            data: { nome, email, senha: senhaHash, papel },
        });

        res.json(novoUsuario);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar usuário" });
    }
});

// Listar todos os usuários
router.get("/", async (req, res) => {
    try {
        const usuarios = await prisma.user.findMany();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuários" });
    }
});

// Buscar usuário por ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await prisma.user.findUnique({ where: { id: parseInt(id) } });

        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuário" });
    }
});

// Atualizar dados de um usuário
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, senha, papel } = req.body;

        // Atualizar senha apenas se for fornecida
        const dataAtualizada = senha
            ? { nome, email, senha: await bcrypt.hash(senha, 10), papel }
            : { nome, email, papel };

        const usuarioAtualizado = await prisma.user.update({
            where: { id: parseInt(id) },
            data: dataAtualizada,
        });

        res.json(usuarioAtualizado);
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
});

// Deletar usuário por ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({ where: { id: parseInt(id) } });
        res.json({ message: "Usuário removido com sucesso" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar usuário" });
    }
});

export default router;