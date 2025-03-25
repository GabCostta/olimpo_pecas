import React, { useState, useEffect } from "react";
import "@styles/Components/Header/Header.css";
import logo from "@assets/img/logo.svg";
import carrinho from "@assets/img/carrinho.svg";
import { Link } from "react-router-dom";

function Header() {
  const [quantidade, setQuantidade] = useState(0);

  const calcularQuantidade = () => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const totalQuantity = savedCart.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    setQuantidade(totalQuantity);
  };

  useEffect(() => {
    calcularQuantidade();
  }, []);

  return (
    <header className="header-mercado-livre-style">
      {/* Primeira linha - Logo + Pesquisa + Login/Carrinho */}
      <div className="header-top-row">
        <div className="header-top-container">
          {/* Logo */}
          <Link to="/" className="logo-link">
            <img src={logo} alt="logo" className="logo" />
          </Link>

          {/* Barra de pesquisa */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Pesquisar produto..."
              className="input-search"
            />
            <button className="search-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </button>
          </div>

          {/* Botões de login/cadastro e carrinho */}
          <div className="user-cart-container">
            <div className="auth-buttons">
              <Link to="/Login" className="auth-button">
                <span className="auth-button-text">Entrar</span>
              </Link>
              <Link to="/Registrar" className="auth-button">
                <span className="auth-button-text">Cadastre-se</span>
              </Link>
            </div>

            {/* Carrinho */}
            <Link to="/Cart" className="carrinho-link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="black"
              >
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
              {quantidade > 0 && (
                <div className="quantidade-carrinho">{quantidade}</div>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Segunda linha - Links de navegação */}
      <div className="header-bottom-row">
        <nav className="nav-links-container">
          <div className="nav-links">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/ProductList" className="nav-link">
              Produtos
            </Link>
            <Link to="/ProductView" className="nav-link">
              Categorias
            </Link>
            <Link to="/CriarProduto" className="nav-link">
              Cadastrar Produto
            </Link>
            <Link to="/CustomerForm" className="nav-link">
              Cadastrar Cliente
            </Link>
            <Link to="/SellerForm" className="nav-link">
              Cadastrar Vendedor
            </Link>
            <Link to="/HistoricoPedidos" className="nav-link">
              Histórico Pedidos
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
