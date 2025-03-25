const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await prisma.user.findUnique({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ mensagem: "Usuário não encontrado!" });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.password);

    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: "Senha incorreta!" });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, role: usuario.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, usuario: { nome: usuario.name, email: usuario.email, role: usuario.role } });
  } catch (erro) {
    res.status(500).json({ mensagem: "Erro no servidor", erro });
  }
});

module.exports = router;
