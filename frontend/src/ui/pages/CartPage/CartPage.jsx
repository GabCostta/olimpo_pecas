import { useState, useEffect } from "react";
import Layout from "@components/Layout/Layout";
import Cards2 from "@components/Cards/Cards2";
import Cards from "@components/Cards/Cards";
import farol from "@assets/img/farol.png";
import axios from "axios";
import flechaRosa from "@assets/img/flecha_icon.svg";
import { Link, useNavigate } from "react-router-dom";
import "@styles/pages/Cartpage/Cartpage.css";

const validateCEP = (cep) => {
  const regex = /^[0-9]{5}-?[0-9]{3}$/;
  return regex.test(cep);
};

function CartItem({ item, updateQuantity, removeItem }) {
  const price = isNaN(item.valoratual) ? 0 : parseFloat(item.valoratual);

  return (
    <div className="cart-item">
      <div className="item-details">
        <img src={farol} alt={item.titulo} />
        <div className="item-info">
          <h2>{item.titulo}</h2>
          {item.cor && <p>Cor: {item.cor}</p>}
          {item.tamanho && <p>Tamanho: {item.tamanho}</p>}
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
        {item.valorantigo && (
          <p className="original-price">R$ {item.valorantigo}</p>
        )}
        <p className="discounted-price">
          R$ {(price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
}

function CartSummary({ cartItems, shipping, discountApplied, onCheckout }) {
  // Cálculos atualizados sempre que os props mudam
  const subtotal = cartItems.reduce((acc, item) => {
    const price = isNaN(item.valoratual) ? 0 : parseFloat(item.valoratual);
    return acc + price * item.quantity;
  }, 0);

  const discount = discountApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;

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
        {discount > 0 && (
          <p>
            Desconto: <span>-R$ {discount.toFixed(2)}</span>
          </p>
        )}
        <p>
          Total: <span className="total-price">R$ {total.toFixed(2)}</span>
        </p>
        {total > 200 && (
          <p className="installments">
            ou 10x de R$ {(total / 10).toFixed(2)} sem juros
          </p>
        )}
        <button className="continue-button" onClick={onCheckout}>
          Finalizar Compra
        </button>
      </div>
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

  // Atualiza o carrinho no localStorage e notifica outros componentes
  const updateCart = (newCart) => {
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCartItems(newCart);
    window.dispatchEvent(new Event("cartUpdated")); // Notifica o Header
  };

  const handleDiscountChange = (e) => {
    setDiscountCode(e.target.value);
    setDiscountError("");
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

  const handleShippingCalculation = () => {
    if (validateCEP(cep)) {
      // Frete fixo de R$40 ou pode ser calculado dinamicamente
      setShipping(40.0);
      setErrorMessage("");
    } else {
      setShipping(0);
      setErrorMessage("CEP inválido. Por favor, insira um CEP válido.");
    }
  };

  const updateQuantity = (item, delta) => {
    const updatedItems = cartItems.map((cartItem) =>
      cartItem.id === item.id
        ? {
            ...cartItem,
            quantity: Math.max(1, cartItem.quantity + delta), // Garante mínimo de 1
          }
        : cartItem
    );
    updateCart(updatedItems);
  };

  const removeItem = (itemId) => {
    const updatedItems = cartItems.filter((cartItem) => cartItem.id !== itemId);
    updateCart(updatedItems);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    const subtotal = cartItems.reduce((acc, item) => {
      const price = isNaN(item.valoratual) ? 0 : parseFloat(item.valoratual);
      return acc + price * item.quantity;
    }, 0);

    const discountValue = discountApplied ? subtotal * 0.1 : 0;
    const total = subtotal + shipping - discountValue;

    localStorage.setItem(
      "checkoutData",
      JSON.stringify({
        subtotal,
        shipping,
        discount: discountValue,
        total,
        cartItems,
      })
    );

    navigate("/Checkout", {
      state: {
        subtotal,
        shipping,
        discount: discountValue,
        total,
        cartItems,
      },
    });
  };

  // Carrega o carrinho inicial
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(savedCart);
  }, []);

  // Carrega produtos relacionados
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://66c77b7e732bf1b79fa6ae9a.mockapi.io/api/produtos"
        );
        setCharacter(response.data);
      } catch (error) {
        console.log("Erro:", error);
      }
    };
    fetchData();
  }, []);

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
              updateQuantity={updateQuantity}
              removeItem={removeItem}
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
                onBlur={handleShippingCalculation}
              />
              <button onClick={handleShippingCalculation}>OK</button>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
          </section>
        </div>

        <CartSummary
          cartItems={cartItems}
          shipping={shipping}
          discountApplied={discountApplied}
          onCheckout={handleCheckout}
        />

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
      </div>
    </Layout>
  );
}

export default CartPage;
