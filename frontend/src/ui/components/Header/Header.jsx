import React, { useState, useEffect } from "react";
import "@styles/Components/Header/Header.css";
import logo from "@assets/img/logo.svg";
import carrinho from "@assets/img/carrinho.svg";
import { Link } from "react-router-dom";

function Header() {
  const [quantidade, setQuantidade] = useState(0);

  // Função para calcular o número de itens no carrinho, feita pelo Nicolas.
  const calcularQuantidade = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalQuantity = savedCart.reduce((acc, item) => acc + item.quantity, 0);
    setQuantidade(totalQuantity);
  };

  useEffect(() => {
    calcularQuantidade();  // Atualiza a quantidade ao carregar o componente
  }, []);

  return (
    <>
      <header>
        <nav>
          <div className="navs">
            <div className="nav-header">
              <Link to="/"><img src={logo} alt="logo" /></Link>
              <input type="text" placeholder="Pesquisar produto..." className="input-icon-search" />
              <Link className="link-cadastro" to="/Registrar">Cadastre-se</Link>
              <button type="button"><Link to="/Login">Entrar</Link></button>
              <Link className="link-carrinho-nav" to="/Cart">
                <img src={carrinho} alt="carrinho" className="icon-carrinho" />
                {
                  <div className="quantidade-carrinho">{quantidade}</div>
                }
              </Link>
            </div>
            <div className="nav-footer">
              <li><Link to="/" className="nav-footer-home">Home</Link></li>
              <li><Link to="/ProductList" className="nav-footer-produtos">Produtos</Link></li>
              <li><Link to="/ProductView" className="nav-footer-categorias">Categorias</Link></li>
              <li><Link to="/Cart" className="nav-footer-pedidos">Carrinho</Link></li>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header