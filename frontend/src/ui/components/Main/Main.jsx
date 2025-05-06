import "@styles/Components/Main/Main.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../../firebaseConfig";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

import logo from "@assets/img/logomain.png";
import gmail from "@assets/img/gmail.svg";
import facebook from "@assets/img/facebook.svg";

function Main() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  // Login com email/senha no Firebase
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      alert("Login realizado com sucesso!");
      navigate("/");
    } catch (error) {
      setErro(error.message);
    }
  };

  // Login com Google
  const handleLoginGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert("Login com Google realizado!");
      navigate("/");
    } catch (error) {
      setErro(error.message);
    }
  };

  // Login com Facebook
  const handleLoginFacebook = async () => {
    const provider = new FacebookAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert("Login com Facebook realizado!");
      navigate("/");
    } catch (error) {
      setErro(error.message);
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
          <h4>Email *</h4>
          <input
            type="email"
            placeholder="Insira seu email"
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
            <button onClick={handleLoginGoogle}>
              <img src={gmail} alt="Login com Gmail" />
            </button>
            <button onClick={handleLoginFacebook}>
              <img src={facebook} alt="Login com Facebook" />
            </button>
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
