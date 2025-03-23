import React, { useState, useEffect } from "react";
import "@styles/Components/OrderHistory/OrderHistory.css";

function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Aqui você pode buscar os pedidos do backend ou de localStorage
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(savedOrders);
  }, []);

  return (
    <div className="order-history">
      <h2>Histórico de Pedidos</h2>
      {orders.length === 0 ? (
        <p>Nenhum pedido encontrado.</p>
      ) : (
        <ul>
          {orders.map((order, index) => (
            <li key={index}>
              <h3>Pedido #{index + 1}</h3>
              <p>Total: R$ {order.total.toFixed(2)}</p>
              <ul>
                {order.items.map((item, i) => (
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
  );
}

export default OrderHistory;
