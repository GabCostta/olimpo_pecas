import "@styles/Components/Main/Main.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "@components/Layout/Layout";
import logo from "@assets/img/logomain.png";
import gmail from "@assets/img/gmail.svg";
import facebook from "@assets/img/facebook.svg";

function CriarContaPage() {
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleCriarConta = async () => {
    try {
      // Envia a requisição para criar a conta
      const resposta = await axios.post("http://localhost:3001/registrar", {
        email,
        nome
      });

      // Armazena o token, se necessário (exemplo de token gerado)
      localStorage.setItem("token", resposta.data.token);

      alert("Conta criada com sucesso!");
      navigate("/home");  // Navega para a página inicial (home)
    } catch (error) {
      // Exibe o erro, caso ocorra
      setErro(error.response?.data?.mensagem || "Erro ao criar conta.");
    }
  };

  return (
    <Layout>
      <main className="main-login">
        <div className="formulario card-formulario">
          <div className="title">
            <h1>Crie sua conta</h1>
            <p>
              Já possui uma conta? Entre <Link to="/Login">aqui</Link>.
            </p>
          </div>
          <div className="conta">
            <h4>Email *</h4>
            <input
              type="email"
              placeholder="Insira seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <h4>Nome Completo *</h4>
            <input
              type="text"
              placeholder="Insira seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <button type="button" onClick={handleCriarConta}>
              Criar Conta
            </button>
            {erro && <p className="erro">{erro}</p>}
          </div>
          <div className="outrologin">
            <p>Ou faça login com</p>
            <div className="img">
              <a
                href="https://accounts.google.com/AccountChooser/signinchooser"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={gmail} alt="Login com Gmail" />
              </a>
              <a
                href="https://www.facebook.com/login/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={facebook} alt="Login com Facebook" />
              </a>
            </div>
          </div>
        </div>
        <div className="fotoSapatos">
          <img src={logo} alt="Logo Olimpo" />
        </div>
      </main>
    </Layout>
  );
}

export default CriarContaPage;
