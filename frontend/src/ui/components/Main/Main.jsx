import "@styles/Components/Main/Main.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "@assets/img/logomain.png";
import gmail from "@assets/img/gmail.svg";
import facebook from "@assets/img/facebook.svg";

function Main() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const resposta = await axios.post("http://localhost:3001/login", {
        email,
        senha
      });

      localStorage.setItem("token", resposta.data.token);
      alert("Login realizado com sucesso!");
      
      if (resposta.data.usuario.role === "vendedor") {
        navigate("/dashboard-vendedor");
      } else {
        navigate("/home");
      }
    } catch (error) {
      setErro(error.response?.data?.mensagem || "Erro ao fazer login.");
    }
  };

  return (
    <main className="main-login">
      <div className="formulario card-formulario">
        <div className="title">
          <h1>Acesse sua conta</h1>
          <p>Novo cliente? Então registre-se <Link to="/Registrar">aqui</Link>.</p>
        </div>
        <div className="conta">
          <h4>Login *</h4>
          <input
            type="text"
            placeholder="Insira seu login ou email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <h4>Senha *</h4>
          <input
            type="password"
            placeholder="Insira sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <Link to="/Error">Esqueci minha senha</Link>
          <button type="button" onClick={handleLogin}>
            Acessar Conta
          </button>
          {erro && <p className="erro">{erro}</p>}
        </div>
        <div className="outrologin">
          <p>Ou faça login com</p>
          <div className="img">
            <a href="https://accounts.google.com/AccountChooser/signinchooser" target="_blank" rel="noopener noreferrer">
              <img src={gmail} alt="Login com Gmail" />
            </a>
            <a href="https://www.facebook.com/login/" target="_blank" rel="noopener noreferrer">
              <img src={facebook} alt="Login com Facebook" />
            </a>
          </div>
        </div>
      </div>
      <div className="fotoSapatos">
        <img src={logo} alt="Logo Olimpo" />
      </div>
    </main>
  );
}

export default Main;
