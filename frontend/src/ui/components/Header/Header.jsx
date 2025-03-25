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
    <header>
      <nav className="header-nav">
        <div className="nav-container">
          {/* Logo */}
          <Link to="/" className="logo-link">
            <img src={logo} alt="logo" className="logo" />
          </Link>

          {/* Links de navegação */}
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
            <Link to="/CadastroCliente" className="nav-link">
              Vendedor
            </Link>
            <Link to="/HistoricoPedidos" className="nav-link">
              Histórico Pedidos
            </Link>
          </div>

          {/* Barra de pesquisa */}
          <input
            type="text"
            placeholder="Pesquisar produto..."
            className="input-search"
          />

          {/* Container para botões e carrinho */}
<div className="auth-cart-container">
  <div className="auth-buttons">
    <Link to="/Registrar" className="auth-button cadastrar">
      Cadastre-se
    </Link>
    <Link to="/Login" className="auth-button entrar">
      Entrar
    </Link>
  </div>

  {/* Carrinho */}
  <Link to="/Cart" className="carrinho-link">
    <img src={carrinho} alt="carrinho" className="icon-carrinho" />
    {quantidade > 0 && (
      <div className="quantidade-carrinho">{quantidade}</div>
    )}
  </Link>
</div>

        </div>
      </nav>
    </header>
  );
}

export default Header;
