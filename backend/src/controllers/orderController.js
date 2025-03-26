import { createOrder, getAllOrders } from "../models/orderModel.js";

export const registerOrder = async (req, res) => {
  try {
    const { items, total } = req.body;

    if (!items || items.length === 0 || !total) {
      return res.status(400).json({ error: "Carrinho vazio ou total inválido" });
    }

    const newOrder = await createOrder(items, total);
    res.status(201).json({ message: "Pedido registrado com sucesso!", order: newOrder });
  } catch (error) {
    console.error("Erro ao registrar pedido:", error);
    res.status(500).json({ error: "Erro interno ao registrar pedido" });
  }
};

export const fetchOrders = async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar pedidos" });
  }
};