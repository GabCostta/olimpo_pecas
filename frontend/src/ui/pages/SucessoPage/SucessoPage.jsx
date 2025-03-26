// frontend\src\ui\pages\SucessoPage\SucessoPage.jsx
import { useEffect } from "react";
import Header from "@components/Header/Header";
import Footer from "@components/Footer/Footer";
import { Link, useLocation } from "react-router-dom";
import "@styles/pages/SucessoPage/SucessoPage.css";
import farol from "@assets/img/farol.png";

function SucessoPage() {
  const location = useLocation();

  // Tenta obter os dados do pedido
  const orderData =
    location.state?.orderData ||
    JSON.parse(localStorage.getItem("lastOrder")) ||
    getFallbackOrderData();

  // Limpar o último pedido do localStorage quando o componente desmontar
  useEffect(() => {
    return () => {
      localStorage.removeItem("lastOrder");
    };
  }, []);

  // Função de fallback para dados fictícios (mantida igual)
  function getFallbackOrderData() {
    return {
      numero: `#${Math.floor(100000 + Math.random() * 900000)}`,
      data: new Date().toLocaleDateString("pt-BR"),
      total: 459.9,
      subtotal: 450.0,
      shippingCost: 9.9,
      discount: 0,
      payment: "credit",
      installments: 3,
      shipping: "standard",
      items: [
        {
          name: "Produto Exemplo",
          price: 150.0,
          quantity: 3,
          image: farol,
        },
      ],
      address: {
        street: "Rua Exemplo",
        number: "123",
        complement: "",
        neighborhood: "Centro",
        city: "São Paulo",
        state: "SP",
        cep: "01001000",
      },
      email: "exemplo@cliente.com",
    };
  }

  // Formata os dados para exibição
  const pedido = {
    numero: orderData.numero,
    data: orderData.data,
    total: formatCurrency(orderData.total),
    formaPagamento: formatPaymentMethod(orderData),
    previsaoEntrega: getDeliveryEstimate(orderData),
    items: orderData.items || [],
    endereco: formatAddress(orderData.address),
    subtotal: formatCurrency(orderData.subtotal),
    frete: formatCurrency(orderData.shippingCost),
    desconto: formatCurrency(orderData.discount),
    email: orderData.email,
  };

  function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0);
  }

  function formatPaymentMethod(data) {
    if (!data.payment) return "Não especificado";

    switch (data.payment) {
      case "credit":
        return `Cartão de Crédito (${data.installments || 1}x)`;
      case "boleto":
        return "Boleto Bancário (5% de desconto)";
      case "pix":
        return "PIX (10% de desconto)";
      default:
        return data.payment;
    }
  }

  function getDeliveryEstimate(data) {
    if (!data.shipping) return "Não especificado";

    const shippingDate = new Date();
    const daysToAdd = data.shipping === "express" ? 3 : 7;
    shippingDate.setDate(shippingDate.getDate() + daysToAdd);
    return shippingDate.toLocaleDateString("pt-BR");
  }

  function formatAddress(address) {
    if (!address) return "Endereço não disponível";
    return `${address.street}, ${address.number}${
      address.complement ? ` - ${address.complement}` : ""
    }, ${address.neighborhood}, ${address.city} - ${address.state}, CEP: ${
      address.cep
    }`;
  }

  return (
    <>
      <Header />
      <div className="sucesso-container">
        <div className="sucesso-card">
          <div className="sucesso-header">
            <h1>Compra realizada com sucesso!</h1>
            <p className="sucesso-mensagem">
              Obrigado por comprar na Olimpo Auto Peças. Seu pedido{" "}
              <strong>{pedido.numero}</strong> foi confirmado e já está sendo
              preparado.
            </p>
            <p>
              Um e-mail de confirmação foi enviado para:{" "}
              <strong>{pedido.email}</strong>
            </p>
          </div>

          <div className="detalhes-pedido">
            <h2>Resumo do seu pedido</h2>
            <div className="detalhes-linha">
              <span>Número do pedido:</span>
              <strong>{pedido.numero}</strong>
            </div>
            <div className="detalhes-linha">
              <span>Data do pedido:</span>
              <strong>{pedido.data}</strong>
            </div>
            <div className="detalhes-linha">
              <span>Subtotal:</span>
              <strong>{pedido.subtotal}</strong>
            </div>
            <div className="detalhes-linha">
              <span>Frete:</span>
              <strong>{pedido.frete}</strong>
            </div>
            {orderData.discount > 0 && (
              <div className="detalhes-linha">
                <span>Desconto:</span>
                <strong>{pedido.desconto}</strong>
              </div>
            )}
            <div className="detalhes-linha">
              <span>Valor total:</span>
              <strong className="valor-total">{pedido.total}</strong>
            </div>
            <div className="detalhes-linha">
              <span>Forma de pagamento:</span>
              <strong>{pedido.formaPagamento}</strong>
            </div>
            <div className="detalhes-linha">
              <span>Endereço de entrega:</span>
              <strong>{pedido.endereco}</strong>
            </div>
            <div className="detalhes-linha">
              <span>Previsão de entrega:</span>
              <strong>{pedido.previsaoEntrega}</strong>
            </div>
          </div>

          <div className="itens-pedido">
            <h3>Itens do Pedido</h3>
            {pedido.items.map((item, index) => (
              <div key={index} className="item-pedido">
                <div className="item-imagem">
                  <img
                    src={item.image || farol}
                    alt={item.name || "Produto"}
                    onError={(e) => {
                      e.target.src = farol;
                    }}
                  />
                  <span className="quantidade">{item.quantity}</span>
                </div>
                <div className="item-info">
                  <h4>{item.name || item.titulo || "Produto"}</h4>
                  <p>{formatCurrency(item.price || item.valoratual || 0)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="acoes-cliente">
            <h2>O que você pode fazer agora?</h2>
            <div className="botoes-acoes">
              <Link to="/ProductList" className="botao-continuar">
                Continuar comprando
              </Link>
              <Link to="" className="botao-rastrear">
                Acompanhar pedido
              </Link>
            </div>
          </div>

          <div className="feedback-cliente">
            <p>Como foi sua experiência de compra?</p>
            <div className="avaliacao-estrelas">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} className="estrela-avaliacao">
                  ★
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default SucessoPage;
