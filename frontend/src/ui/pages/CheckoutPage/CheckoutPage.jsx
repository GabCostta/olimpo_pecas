import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "@styles/pages/CheckoutPage/CheckoutPage.css";
import Layout from "@components/Layout/Layout.jsx";// Caminho ajustado conforme necessário

function CheckoutPage() {
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

  const handleFinalizarCompra = () => {
    if (!isLoggedIn) {
      alert("Você precisa estar logado para finalizar a compra.");
      navigate("/Registrar");
      return;
    }

    if (!selectedPayment || !selectedAddress) {
      alert("Selecione um método de pagamento e um endereço de entrega.");
      return;
    }

    alert("Compra finalizada com sucesso!");
    navigate("/Sucesso");
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
              Total dos Produtos: <span>R$682,58</span>
            </p>
            <p>
              Total do Frete: <span>R$209,78</span>
            </p>
            <p>
              Cupom de Desconto: <span>-R$1,95</span>
            </p>
            <p className="total">
              Total: <span>R$890,41</span>
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

export default CheckoutPage;
