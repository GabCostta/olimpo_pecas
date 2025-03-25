import React, { useState, useEffect } from "react";
import Layout from "@components/Layout/Layout.jsx";
import "@styles/pages/OrderHistory/OrderHistory.css";

function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/orders")
      .then(response => response.json())
      .then(data => {
        const parsedOrders = data.map(order => ({
          ...order,
          items: parseItems(order.items),
        }));
        setOrders(parsedOrders);
      })
      .catch(error => console.error("Erro ao buscar pedidos:", error));
  }, []);

  // Função para garantir que `items` seja um array
  function parseItems(items) {
    if (!items) return [];
    if (Array.isArray(items)) return items;
    try {
      const parsed = JSON.parse(items);
      return Array.isArray(parsed) ? parsed : []; // Garante que seja array
    } catch (error) {
      console.error("Erro ao converter JSON de items:", error);
      return [];
    }
  }

  return (
    <Layout>
      <div className="order-history">
        <h2>Histórico de Pedidos</h2>
        {orders.length === 0 ? (
          <p>Nenhum pedido encontrado.</p>
        ) : (
          <ul>
            {orders.map((order, index) => (
              <li key={order.id}>
                <h3>Pedido #{index + 1}</h3>
                <p>Total: R$ {order.total?.toFixed(2)}</p>
                <ul>
                  {(order.items || []).map((item, i) => (
                    <li key={i}>
                      {item.titulo} - {item.quantity}x R$ {item.valoratual}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}

export default OrderHistory;
