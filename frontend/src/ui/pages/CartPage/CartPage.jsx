import { useState, useEffect } from "react";
import Layout from "@components/Layout/Layout";
import Cards2 from "@components/Cards/Cards2";
import Cards from "@components/Cards/Cards";
import CheckoutPage from "@pages/CheckoutPage/CheckoutPage";
import farol from "@assets/img/farol.png";
import axios from "axios";
import flechaRosa from "@assets/img/flecha_icon.svg";
import { Link, useNavigate } from "react-router-dom";
import "@styles/pages/Cartpage/Cartpage.css";

const validateCEP = (cep) => {
  // Valida se o CEP tem o formato correto (XXXXX-XXX ou XXXXXXXX)
  const regex = /^[0-9]{5}-?[0-9]{3}$/;
  return regex.test(cep);
};

const handleShippingCalculation = (cep, setShipping, setErrorMessage) => {
  if (validateCEP(cep)) {
    // Se o CEP for válido, adiciona o valor do frete
    setShipping(40.0);
    setErrorMessage(""); // Limpa a mensagem de erro
  } else {
    // Se o CEP for inválido, exibe uma mensagem de erro
    setShipping(0);
    setErrorMessage("CEP inválido. Por favor, insira um CEP válido.");
  }
};

function CartItem({ item, updateQuantity, removeItem }) {
  const price = isNaN(item.valoratual) ? 0 : parseFloat(item.valoratual);

  return (
    <div className="cart-item">
      <div className="item-details">
        <img src={farol} alt={item.titulo} />
        <div className="item-info">
          <h2>{item.titulo}</h2>
          <p>Cor: {item.cor}</p>
          <p>Tamanho: {item.tamanho}</p>
        </div>
      </div>
      <div className="item-quantity">
        <div>
          <button onClick={() => updateQuantity(item, -1)}>−</button>
          <span>{item.quantity}</span>
          <button onClick={() => updateQuantity(item, 1)}>+</button>
        </div>
        <a href="#" className="remove-item" onClick={() => removeItem(item.id)}>
          Remover item
        </a>
      </div>
      <div className="item-pricing">
        <p className="original-price">R$ {item.valorantigo}</p>
        <p className="discounted-price">
          R$ {(price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
}

const updateQuantity = (item, delta, cartItems, setCartItems) => {
  if (item.quantity + delta >= 1) {
    const updatedItems = cartItems.map((cartItem) =>
      cartItem.id === item.id
        ? { ...cartItem, quantity: cartItem.quantity + delta }
        : cartItem
    );
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
  }
};

const removeItem = (itemId, cartItems, setCartItems) => {
  const updatedItems = cartItems.filter((cartItem) => cartItem.id !== itemId);
  setCartItems(updatedItems);
  localStorage.setItem("cart", JSON.stringify(updatedItems));
};

function CartSummary({ cartItems, shipping, discountApplied, onCheckout }) {
  // Cálculo dentro do componente para garantir consistência
  const subtotal = cartItems.reduce((acc, item) => {
    const price = isNaN(item.valoratual)
      ? 0
      : parseFloat(item.valoratual.toString().replace(",", "."));
    return acc + price * item.quantity;
  }, 0);

  const totalWithShipping = subtotal + shipping;
  const discount = discountApplied ? totalWithShipping * 0.1 : 0;
  const total = totalWithShipping - discount;

  return (
    <div className="cart-summary">
      <h2>RESUMO</h2>
      <div className="summary-details">
        <p>
          Subtotal: <span>R$ {subtotal.toFixed(2)}</span>
        </p>
        <p>
          Frete: <span>R$ {shipping.toFixed(2)}</span>
        </p>
        <p>
          Desconto: <span>R$ {discount.toFixed(2)}</span>
        </p>
        <p>
          Total:{" "}
          <span className="total-price">
            {total === 0 ? "R$ 0,00" : `R$ ${Math.max(total, 0).toFixed(2)}`}
          </span>
        </p>
        {total > 200 && (
          <p className="installments">
            ou 10x de R$ {(total / 10).toFixed(2)} sem juros
          </p>
        )}
        {total <= 200 && total !== 0 && (
          <p className="installments">
            Adicione mais itens para aproveitar o desconto!
          </p>
        )}
        {total === 0 && (
          <p className="installments">Seu carrinho está vazio.</p>
        )}
      </div>
      <button className="continue-button" onClick={onCheckout}>
        Finalizar Compra
      </button>
    </div>
  );
}

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [character, setCharacter] = useState([]);
  const [shipping, setShipping] = useState(0);
  const [cep, setCep] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountError, setDiscountError] = useState("");
  const navigate = useNavigate();

  const handleDiscountChange = (e) => {
    setDiscountCode(e.target.value);
  };

  const applyDiscount = () => {
    if (discountCode.toLowerCase() === "olimpo") {
      setDiscountApplied(true);
      setDiscountError("");
    } else {
      setDiscountApplied(false);
      setDiscountError("Código de desconto incorreto!");
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }
  
    // Cálculo consistente com o CartSummary
    const subtotal = cartItems.reduce((acc, item) => {
      const price = isNaN(item.valoratual)
        ? 0
        : parseFloat(item.valoratual.toString().replace(",", "."));
      return acc + price * item.quantity;
    }, 0);
  
    const totalWithShipping = subtotal + shipping;
    const discountValue = discountApplied ? totalWithShipping * 0.1 : 0;
    const total = totalWithShipping - discountValue;
  
    navigate("/Checkout", {
      state: {
        subtotal,
        shipping,
        discount: discountValue,
        total,
        cartItems
      }
    });
  };

  // Função para finalizar a compra e registrar o pedido no backend
  const finalizePurchase = async () => {
    if (cartItems.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }
    // Calcula o total (produto + frete)
    const total =
      cartItems.reduce((acc, item) => {
        const price = isNaN(item.valoratual)
          ? 0
          : parseFloat(item.valoratual.toString().replace(",", "."));
        return acc + price * item.quantity;
      }, 0) + shipping;

    try {
      const response = await axios.post("http://localhost:3001/orders", {
        items: cartItems,
        total: total,
      });
      alert("Compra finalizada com sucesso!");
      setCartItems([]);
      localStorage.removeItem("cart");
    } catch (error) {
      console.error("Erro ao finalizar a compra:", error);
      alert("Erro ao finalizar a compra. Tente novamente.");
    }
  };

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(savedCart);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://66c77b7e732bf1b79fa6ae9a.mockapi.io/api/produtos"
        );
        setCharacter(response.data);
        console.log("API response:", response.data);
      } catch (error) {
        console.log("Erro: ${error}");
      }
    };
    fetchData();
  }, []);

  // Cálculos movidos para antes do return
  const total = cartItems.reduce((acc, item) => {
    const price = isNaN(item.valoratual)
      ? 0
      : parseFloat(item.valoratual.toString().replace(",", "."));
    return acc + price * item.quantity;
  }, 0);

  const totalWithShipping = total + shipping;
  const discount = discountApplied ? totalWithShipping * 0.1 : 0;
  const totalWithDiscount = totalWithShipping - discount;

  return (
    <Layout>
      <div className="cart-page">
        <div className="cart-content">
          <div className="cart-header">
            <h2>MEU CARRINHO</h2>
            <h2>QUANTIDADE</h2>
            <h2>UNITÁRIO</h2>
            <h2>TOTAL</h2>
          </div>
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              updateQuantity={(item, delta) =>
                updateQuantity(item, delta, cartItems, setCartItems)
              }
              removeItem={(itemId) =>
                removeItem(itemId, cartItems, setCartItems)
              }
            />
          ))}
          <section className="discount-shipping">
            <div className="discount">
              <strong>Calcular desconto</strong>
              <input
                type="text"
                placeholder="Digite o código de desconto"
                value={discountCode}
                onChange={handleDiscountChange}
              />
              <button onClick={applyDiscount}>OK</button>
              {discountError && (
                <p className="error-message">{discountError}</p>
              )}
            </div>
            <div className="shipping">
              <strong>Calcular Frete</strong>
              <input
                type="text"
                placeholder="Insira seu CEP"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
              />
              <button
                onClick={() =>
                  handleShippingCalculation(cep, setShipping, setErrorMessage)
                }
              >
                OK
              </button>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
          </section>
          {/* Botão de Finalizar Compra*/}
          <button className="finalize-purchase" onClick={finalizePurchase}>
            Finalizar Compra
          </button>
        </div>
        <CartSummary
          cartItems={cartItems}
          shipping={shipping}
          discountApplied={discountApplied}
          onCheckout={handleCheckout}
        />
      </div>
      <section className="container-produtos-em-alta">
        <div className="produtos-em-alta">
          <div className="topico-section">
            <h1>Produtos Relacionados</h1>
            <h2>
              <Link to="/ProductList" className="link-ver-todos">
                Ver todos <img src={flechaRosa} alt="flecha" />
              </Link>
            </h2>
          </div>
          <div className="produto-em-alta-cards">
            {Array.isArray(character) &&
              character
                .slice(0, 4)
                .map((card) =>
                  card.desconto === true ? (
                    <Cards2
                      key={card.id}
                      oferta={card.valordesconto}
                      foto={farol}
                      titulo={card.titulo}
                      descricao={card.descricao}
                      valorantigo={card.valorantigo}
                      valoratual={card.valoratual}
                    />
                  ) : (
                    <Cards
                      key={card.id}
                      foto={farol}
                      titulo={card.titulo}
                      descricao={card.descricao}
                      valorantigo={card.valorantigo}
                      valoratual={card.valoratual}
                    />
                  )
                )}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default CartPage;
