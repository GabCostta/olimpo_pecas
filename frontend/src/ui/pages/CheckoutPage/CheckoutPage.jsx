import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "@styles/pages/CheckoutPage/CheckoutPage.css";
import Layout from "@components/Layout/Layout.jsx";
import PropTypes from "prop-types";
import axios from "axios";
import farol from "@assets/img/farol.png";

function CheckoutPage({ setCartItems }) {
  const location = useLocation();
  const navigate = useNavigate();
  const fallbackData = JSON.parse(localStorage.getItem("checkoutData")) || {};
  const {
    subtotal = 0,
    shipping = 0,
    discount = 0,
    total = 0,
    cartItems = [],
  } = location.state || fallbackData;

  // Step 1: Identificação
  const [email, setEmail] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  // Step 2: Endereço
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [selectedShipping, setSelectedShipping] = useState("");

  // Step 3: Pagamento
  const [selectedPayment, setSelectedPayment] = useState("");
  const [installments, setInstallments] = useState(1);
  const [installmentOptions, setInstallmentOptions] = useState([]);
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const shippingOptions = [
    {
      id: "standard",
      name: "Envio Padrão",
      price: 15.9,
      days: "5-7 dias úteis",
    },
    {
      id: "express",
      name: "Envio Expresso",
      price: 29.9,
      days: "2-3 dias úteis",
    },
  ];

  const paymentMethods = [
    { id: "credit", name: "Cartão de Crédito" },
    { id: "boleto", name: "Boleto Bancário" },
    { id: "pix", name: "PIX" },
  ];

  // Calcular opções de parcelamento
  useEffect(() => {
    if (selectedPayment === "credit" && total > 0) {
      const options = [];
      const maxInstallments = Math.min(10, Math.floor(total / 10));

      for (let i = 1; i <= maxInstallments; i++) {
        const installmentValue = total / i;
        options.push({
          value: i,
          label: `${i}x de R$ ${installmentValue.toFixed(2)} ${
            i > 1 ? "sem juros" : ""
          }`,
        });
      }

      setInstallmentOptions(options);
      setInstallments(1);
    }
  }, [total, selectedPayment]);

  const handleFetchAddress = async () => {
    const cepRegex = /^[0-9]{8}$/;
    if (!cepRegex.test(cep)) {
      alert("Digite um CEP válido com 8 números.");
      return;
    }
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setAddress(data.logradouro || "");
        setNeighborhood(data.bairro || "");
        setCity(data.localidade || "");
        setState(data.uf || "");
      } else {
        alert("CEP não encontrado");
      }
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
    }
  };


  const validateStep = (step) => {
    switch (step) {
      case 1:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          alert("Por favor, insira um e-mail válido.");
          return false;
        }
        return true;
      case 2:
        if (
          !cep ||
          !address ||
          !number ||
          !neighborhood ||
          !city ||
          !state ||
          !selectedShipping
        ) {
          alert(
            "Por favor, preencha todos os campos do endereço e selecione uma forma de envio."
          );
          return false;
        }
        return true;
      case 3:
        if (!selectedPayment) {
          alert("Por favor, selecione um método de pagamento.");
          return false;
        }
        if (
          selectedPayment === "credit" &&
          (!cardData.number ||
            !cardData.name ||
            !cardData.expiry ||
            !cardData.cvv)
        ) {
          alert("Por favor, preencha todos os dados do cartão.");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFinalizarCompra = async () => {
    if (!validateStep(currentStep)) return;

    try {
      // Calcula o total com desconto conforme método de pagamento
      const finalTotal =
        selectedPayment === "pix"
          ? total * 0.9
          : selectedPayment === "boleto"
          ? total * 0.95
          : total;

      // Prepara os dados do pedido mantendo a estrutura original
      const orderData = {
        email,
        items: cartItems,
        address: {
          cep,
          street: address,
          number,
          complement,
          neighborhood,
          city,
          state,
        },
        shipping: selectedShipping,
        payment: selectedPayment,
        installments: selectedPayment === "credit" ? installments : 1,
        subtotal,
        shippingCost:
          shippingOptions.find((s) => s.id === selectedShipping)?.price || 0,
        discount,
        total: finalTotal,
        // Acampos para a página de sucesso
        numero: `#${Date.now().toString().slice(-8)}`, // Número simples baseado no timestamp
        data: new Date().toLocaleDateString("pt-BR"),
      };

      //  envio para a API 
      const response = await axios.post(
        "http://localhost:3001/orders",
        orderData
      );

      // limpeza do carrinho
      if (setCartItems) {
        setCartItems([]);
      }
      localStorage.removeItem("cart");

      // fallback no localStorage apenas
      localStorage.setItem("lastOrder", JSON.stringify(orderData));

      // Navega para a página de sucesso com os dados
      navigate("/Sucesso", { state: { orderData } });
    } catch (error) {
      console.error("Erro ao finalizar a compra:", error);
      alert("Erro ao finalizar a compra. Tente novamente.");
    }
  };

  const handleCardDataChange = (e) => {
    const { name, value } = e.target;

    if (name === "number") {
      const formattedValue = value
        .replace(/\s?/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
      setCardData({ ...cardData, [name]: formattedValue });
      return;
    }

    if (name === "expiry") {
      const formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2");
      setCardData({ ...cardData, [name]: formattedValue });
      return;
    }

    setCardData({ ...cardData, [name]: value });
  };

  const renderOrderItems = () => {
    return (
      <div className="order-items-container">
        <h3>Itens do Pedido</h3>
        {cartItems.map((item, index) => (
          <div key={index} className="order-item">
            <div className="item-image">
              <img
                src={item.image || farol}
                alt={item.titulo || item.name}
                onError={(e) => {
                  e.target.src = farol;
                }}
              />
              <span className="item-quantity">{item.quantity}</span>
            </div>
            <div className="item-details">
              <h4>{item.titulo || item.name}</h4>
              {item.cor && <p>Cor: {item.cor}</p>}
              {item.tamanho && <p>Tamanho: {item.tamanho}</p>}
              <p className="item-price">
                R${" "}
                {((item.valoratual || item.price) * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="checkout-page">
        <h1>Finalização da Compra</h1>

        <div className="checkout-progress">
          <div className={`progress-step ${currentStep >= 1 ? "active" : ""}`}>
            <span>1</span>
            <p>Identificação</p>
          </div>
          <div className={`progress-step ${currentStep >= 2 ? "active" : ""}`}>
            <span>2</span>
            <p>Endereço</p>
          </div>
          <div className={`progress-step ${currentStep >= 3 ? "active" : ""}`}>
            <span>3</span>
            <p>Pagamento</p>
          </div>
          <div className={`progress-step ${currentStep >= 4 ? "active" : ""}`}>
            <span>4</span>
            <p>Confirmação</p>
          </div>
        </div>

        {currentStep === 1 && (
          <div className="checkout-card">
            <h2>Identificação</h2>
            <div className="form-group">
              <label>E-mail</label>
              <input
                type="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="info-text">
                Enviaremos a confirmação do pedido para este e-mail
              </p>
            </div>
            <div className="card-actions">
              <button className="next-button" onClick={handleNextStep}>
                Continuar
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="checkout-card">
            <h2>Endereço de Entrega</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>CEP</label>
                <input
                  type="text"
                  placeholder="CEP"
                  value={cep}
                  onChange={(e) => setCep(e.target.value.replace(/\D/g, ""))}
                  onBlur={handleFetchAddress}
                  maxLength={8}
                  required
                />
              </div>
              <div className="form-group">
                <label>Endereço</label>
                <input
                  type="text"
                  placeholder="Rua/Avenida"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Número</label>
                <input
                  type="text"
                  placeholder="Número"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Complemento</label>
                <input
                  type="text"
                  placeholder="Complemento"
                  value={complement}
                  onChange={(e) => setComplement(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Bairro</label>
                <input
                  type="text"
                  placeholder="Bairro"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Cidade</label>
                <input
                  type="text"
                  placeholder="Cidade"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Estado</label>
                <input
                  type="text"
                  placeholder="UF"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </div>
            </div>

            <h3>Forma de Envio</h3>
            <div className="shipping-options">
              {shippingOptions.map((option) => (
                <div
                  key={option.id}
                  className={`shipping-option ${
                    selectedShipping === option.id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedShipping(option.id)}
                >
                  <input
                    type="radio"
                    id={`shipping-${option.id}`}
                    name="shipping"
                    checked={selectedShipping === option.id}
                    onChange={() => setSelectedShipping(option.id)}
                  />
                  <label htmlFor={`shipping-${option.id}`}>
                    <span className="option-name">{option.name}</span>
                    <span className="option-days">{option.days}</span>
                    <span className="option-price">
                      R$ {option.price.toFixed(2)}
                    </span>
                  </label>
                </div>
              ))}
            </div>

            <div className="card-actions">
              <button className="back-button" onClick={handlePrevStep}>
                Voltar
              </button>
              <button className="next-button" onClick={handleNextStep}>
                Continuar
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="checkout-card">
            <h2>Método de Pagamento</h2>
            <div className="payment-options">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`payment-option ${
                    selectedPayment === method.id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedPayment(method.id)}
                >
                  <input
                    type="radio"
                    id={`payment-${method.id}`}
                    name="payment"
                    checked={selectedPayment === method.id}
                    onChange={() => setSelectedPayment(method.id)}
                  />
                  <label htmlFor={`payment-${method.id}`}>{method.name}</label>
                </div>
              ))}
            </div>

            {selectedPayment === "credit" && (
              <div className="credit-card-form">
                <h3>Dados do Cartão</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Número do Cartão</label>
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      name="number"
                      value={cardData.number}
                      onChange={handleCardDataChange}
                      maxLength="19"
                    />
                  </div>
                  <div className="form-group">
                    <label>Nome no Cartão</label>
                    <input
                      type="text"
                      placeholder="Nome como no cartão"
                      name="name"
                      value={cardData.name}
                      onChange={handleCardDataChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Validade</label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      name="expiry"
                      value={cardData.expiry}
                      onChange={handleCardDataChange}
                      maxLength="5"
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      placeholder="000"
                      name="cvv"
                      value={cardData.cvv}
                      onChange={handleCardDataChange}
                      maxLength="3"
                    />
                  </div>
                </div>

                <div className="installment-options">
                  <h4>Parcelamento</h4>
                  <select
                    value={installments}
                    onChange={(e) => setInstallments(parseInt(e.target.value))}
                    className="installment-select"
                  >
                    {installmentOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {selectedPayment === "boleto" && (
              <div className="payment-info">
                <h3>Boleto Bancário</h3>
                <p>O boleto será gerado após a confirmação da compra.</p>
                <p className="discount-info">
                  Pagamento à vista com 5% de desconto: R${" "}
                  {(total * 0.95).toFixed(2)}
                </p>
              </div>
            )}

            {selectedPayment === "pix" && (
              <div className="payment-info">
                <h3>PIX</h3>
                <p>O QR Code será gerado após a confirmação da compra.</p>
                <p className="discount-info">
                  Pagamento à vista com 10% de desconto: R${" "}
                  {(total * 0.9).toFixed(2)}
                </p>
              </div>
            )}

            <div className="card-actions">
              <button className="back-button" onClick={handlePrevStep}>
                Voltar
              </button>
              <button className="next-button" onClick={handleNextStep}>
                Continuar
              </button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="checkout-summary">
            <div className="checkout-card">
              <h2>Resumo do Pedido</h2>

              <div className="summary-section">
                <h3>Informações Pessoais</h3>
                <p>
                  <strong>E-mail:</strong> {email}
                </p>
              </div>

              <div className="summary-section">
                <h3>Endereço de Entrega</h3>
                <p>
                  {address}, {number} {complement && `- ${complement}`}
                </p>
                <p>
                  {neighborhood}, {city} - {state}
                </p>
                <p>CEP: {cep}</p>
                <p>
                  <strong>Forma de Envio:</strong>{" "}
                  {shippingOptions.find((s) => s.id === selectedShipping)?.name}
                </p>
              </div>

              <div className="summary-section">
                <h3>Pagamento</h3>
                <p>
                  <strong>Método:</strong>{" "}
                  {paymentMethods.find((p) => p.id === selectedPayment)?.name}
                </p>
                {selectedPayment === "credit" && (
                  <>
                    <p>
                      <strong>Cartão:</strong> **** **** ****{" "}
                      {cardData.number.slice(-4)}
                    </p>
                    <p>
                      <strong>Parcelas:</strong> {installments}x de R${" "}
                      {(total / installments).toFixed(2)}
                    </p>
                  </>
                )}
                {selectedPayment === "boleto" && (
                  <p>
                    <strong>Desconto:</strong> 5% (Total: R${" "}
                    {(total * 0.95).toFixed(2)})
                  </p>
                )}
                {selectedPayment === "pix" && (
                  <p>
                    <strong>Desconto:</strong> 10% (Total: R${" "}
                    {(total * 0.9).toFixed(2)})
                  </p>
                )}
              </div>

              {renderOrderItems()}

              <div className="summary-totals">
                <div className="total-row">
                  <span>Subtotal ({cartItems.length} itens):</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Frete:</span>
                  <span>
                    R${" "}
                    {shippingOptions
                      .find((s) => s.id === selectedShipping)
                      ?.price.toFixed(2) || "0.00"}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="total-row discount">
                    <span>Desconto:</span>
                    <span>-R$ {discount.toFixed(2)}</span>
                  </div>
                )}
                {(selectedPayment === "boleto" ||
                  selectedPayment === "pix") && (
                  <div className="total-row discount">
                    <span>Desconto à vista:</span>
                    <span>
                      -R${" "}
                      {selectedPayment === "pix"
                        ? (total * 0.1).toFixed(2)
                        : (total * 0.05).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="total-row grand-total">
                  <span>Total:</span>
                  <span>
                    R${" "}
                    {selectedPayment === "pix"
                      ? (total * 0.9).toFixed(2)
                      : selectedPayment === "boleto"
                      ? (total * 0.95).toFixed(2)
                      : total.toFixed(2)}
                  </span>
                </div>
                {selectedPayment === "credit" && installments > 1 && (
                  <div className="total-row installment-info">
                    <span>ou {installments}x de:</span>
                    <span>R$ {(total / installments).toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="card-actions">
                <button className="back-button" onClick={handlePrevStep}>
                  Voltar
                </button>
                <button
                  className="confirm-button"
                  onClick={handleFinalizarCompra}
                >
                  Finalizar Compra
                </button>
              </div>
            </div>
          </div>
        )}
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
      cartItems: PropTypes.array,
    }),
  }),
};

export default CheckoutPage;
