import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";

export default {
  async createUser(req, res) {
    try {
      const { nome, email, senha, papel } = req.body;
      const senhaHash = await bcrypt.hash(senha, 10);
      const novoUsuario = await userModel.createUser({ nome, email, senha: senhaHash, papel });
      res.json(novoUsuario);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar usuário" });
    }
  },

  async getAllUsers(req, res) {
    try {
      const usuarios = await userModel.getAllUsers();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar usuários" });
    }
  },

  async getUserById(req, res) {
    try {
      const usuario = await userModel.getUserById(req.params.id);
      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar usuário" });
    }
  },

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { nome, email, senha, papel } = req.body;
      const dataAtualizada = senha
        ? { nome, email, senha: await bcrypt.hash(senha, 10), papel }
        : { nome, email, papel };

      const usuarioAtualizado = await userModel.updateUser(id, dataAtualizada);
      res.json(usuarioAtualizado);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
  },

  async deleteUser(req, res) {
    try {
      await userModel.deleteUser(req.params.id);
      res.json({ message: "Usuário removido com sucesso" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar usuário" });
    }
  },
};