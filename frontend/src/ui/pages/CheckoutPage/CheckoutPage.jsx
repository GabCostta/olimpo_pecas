import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "@styles/pages/CheckoutPage/CheckoutPage.css";
import Layout from "@components/Layout/Layout.jsx";
import PropTypes from 'prop-types';
import axios from 'axios';

function CheckoutPage({ setCartItems }) {  // Recebe setCartItems como prop
  const location = useLocation();
  const fallbackData = JSON.parse(localStorage.getItem('checkoutData')) || {};
  const { 
    subtotal = 0,
    shipping = 0,
    discount = 0,
    total = 0,
    cartItems = []
  } = location.state || fallbackData;
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const navigate = useNavigate();

  const addresses = [
    { id: 1, name: "Casa", address: "Rua das Flores, 123 - São Paulo, SP" },
    { id: 2, name: "Trabalho", address: "Av. Paulista, 1000 - São Paulo, SP" },
  ];

  const paymentMethods = [
    { id: 1, name: "Cartão de Crédito" },
    { id: 2, name: "Boleto Bancário" },
    { id: 3, name: "PIX" },
  ];

  const handleFinalizarCompra = async () => {
    if (!selectedPayment ) {
      alert("Selecione um método de pagamento.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/orders", {
        items: cartItems,
        total: total,
        paymentMethod: selectedPayment,
        shippingAddress: selectedAddress
      });

      // Limpa o carrinho
      if (setCartItems) {
        setCartItems([]);
      }
      localStorage.removeItem("cart");
      localStorage.removeItem("checkoutData");
      
      alert("Compra finalizada com sucesso!");
      navigate("/Sucesso");
    } catch (error) {
      console.error("Erro ao finalizar a compra:", error);
      alert("Erro ao finalizar a compra. Tente novamente.");
    }
  };


  const handlePaymentSelection = (method) => {
    setSelectedPayment(method);
    setShowPaymentForm(true);
  };

  const handleCardDataChange = (e) => {
    const { name, value } = e.target;
    setCardData({ ...cardData, [name]: value });
  };

  return (
    <Layout>
      <div className="checkout-page">
        <h1>Finalização da Compra</h1>

        {/* Seção de Endereço de Entrega */}
        <section className="address-section">
          <h2>Endereço de Entrega</h2>
          {isLoggedIn ? (
            <>
              {addresses.map((addr) => (
                <div key={addr.id} className="address-option">
                  <input
                    type="radio"
                    id={`address-${addr.id}`}
                    name="address"
                    value={addr.id}
                    onChange={() => setSelectedAddress(addr.id)}
                  />
                  <label htmlFor={`address-${addr.id}`}>
                    <strong>{addr.name}</strong>: {addr.address}
                  </label>
                </div>
              ))}
              <button className="add-address-button">
                Adicionar Novo Endereço
              </button>
            </>
          ) : (
            <p>
              Você precisa{" "}
              <Link to="/Registrar" className="login-link">
                fazer login
              </Link>{" "}
              ou{" "}
              <Link to="/Registrar" className="register-link">
                cadastrar-se
              </Link>{" "}
              para continuar.
            </p>
          )}
        </section>

        {/* Seção de Métodos de Pagamento */}
        <section className="payment-section">
          <h2>Método de Pagamento</h2>
          {paymentMethods.map((method) => (
            <div key={method.id} className="payment-option">
              <input
                type="radio"
                id={`payment-${method.id}`}
                name="payment"
                value={method.id}
                onChange={() => handlePaymentSelection(method.name)}
              />
              <label htmlFor={`payment-${method.id}`}>{method.name}</label>
            </div>
          ))}

          {/* Formulário de Pagamento */}
          {showPaymentForm && selectedPayment === "Cartão de Crédito" && (
            <div className="payment-form">
              <h3>Dados do Cartão</h3>
              <input
                type="text"
                name="number"
                placeholder="Número do Cartão"
                value={cardData.number}
                onChange={handleCardDataChange}
              />
              <input
                type="text"
                name="name"
                placeholder="Nome no Cartão"
                value={cardData.name}
                onChange={handleCardDataChange}
              />
              <input
                type="text"
                name="expiry"
                placeholder="Validade (MM/AA)"
                value={cardData.expiry}
                onChange={handleCardDataChange}
              />
              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                value={cardData.cvv}
                onChange={handleCardDataChange}
              />
            </div>
          )}

          {showPaymentForm && selectedPayment === "Boleto Bancário" && (
            <div className="payment-form">
              <h3>Boleto Bancário</h3>
              <p>O boleto será gerado após a confirmação da compra.</p>
            </div>
          )}

          {showPaymentForm && selectedPayment === "PIX" && (
            <div className="payment-form">
              <h3>PIX</h3>
              <p>O QR Code será gerado após a confirmação da compra.</p>
            </div>
          )}
        </section>

        {/* Resumo da Compra */}
        <section className="summary-section">
        <h2>Resumo da Compra</h2>
        <div className="summary-details">
          <p>
            Subtotal ({cartItems.length} itens): 
            <span> R$ {subtotal.toFixed(2)}</span>
          </p>
          <p>
            Frete: <span>R$ {shipping.toFixed(2)}</span>
          </p>
          {discount > 0 && (
            <p>
              Desconto: <span>-R$ {discount.toFixed(2)}</span>
            </p>
          )}
          <p className="total">
            Total: <span>R$ {total.toFixed(2)}</span>
          </p>
        </div>
      </section>

        <button
          className="finalizar-compra-button"
          onClick={handleFinalizarCompra}
        >
          Finalizar Compra
        </button>
      </div>
    </Layout>
  );
}


CheckoutPage.propTypes = {
  setCartItems: PropTypes.func,
  location: PropTypes.shape({
    state: PropTypes.shape({
      subtotal: PropTypes.number,
      shipping: PropTypes.number,
      discount: PropTypes.number,
      total: PropTypes.number,
      cartItems: PropTypes.array
    })
  })
};

export default CheckoutPage;