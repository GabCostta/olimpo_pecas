import ProductModel from "../models/ProductModel.js";

export default {
  async createProduct(req, res) {
    try {
      const { name, descricao, preco } = req.body;
      const novoProduto = await ProductModel.createProduct({ name, descricao, preco });
      res.status(201).json(novoProduto);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar produto" });
    }
  },

  async getAllProducts(req, res) {
    try {
      const produtos = await ProductModel.getAllProducts();
      res.json(produtos);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar produtos" });
    }
  },

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const { name, descricao, preco } = req.body;
      const produtoAtualizado = await ProductModel.updateProduct(id, { name, descricao, preco });
      res.json(produtoAtualizado);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar produto" });
    }
  },

  async deleteProduct(req, res) {
    try {
      await ProductModel.deleteProduct(req.params.id);
      res.json({ message: "Produto removido com sucesso" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar produto" });
    }
  },
};