import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const router = express.Router();
const prisma = new PrismaClient();

// Criar um novo usuário (Cliente ou Vendedor)
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
