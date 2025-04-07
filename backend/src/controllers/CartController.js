import CartModel from "../models/CartModel.js";

export default {
  async addItem(req, res) {
    try {
      const { userId, produtoId, quantidade } = req.body;
      const novoItem = await CartModel.addItem({ userId, produtoId, quantidade });
      res.status(201).json(novoItem);
    } catch (error) {
      res.status(500).json({ error: "Erro ao adicionar item ao carrinho" });
    }
  },

  async getUserCart(req, res) {
    try {
      const userId = Number(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "ID do usuário inválido" });
      }
      const carrinho = await CartModel.getUserCart(userId);
      res.json(carrinho);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar o carrinho" });
    }
  },

  async updateItem(req, res) {
    try {
      const itemAtualizado = await CartModel.updateItemQuantity(
        req.params.id,
        req.body.quantidade
      );
      res.json(itemAtualizado);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar item do carrinho" });
    }
  },

  async removeItem(req, res) {
    try {
      await CartModel.removeItem(req.params.id);
      res.json({ message: "Item removido do carrinho" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao remover item do carrinho" });
    }
  },
};