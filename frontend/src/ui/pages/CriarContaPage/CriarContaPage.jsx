import "@styles/Components/Main/Main.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../../firebaseConfig"; 
import { 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  FacebookAuthProvider 
} from "firebase/auth";

import logo from "@assets/img/logomain.png";
import gmail from "@assets/img/gmail.svg";
import facebook from "@assets/img/facebook.svg";
import Layout from "@components/Layout/Layout";

function CriarContaPage() {
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  // Criar conta com email/senha no Firebase
  const handleCriarConta = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      alert("Conta criada com sucesso!");
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
    <Layout>
      <main className="main-login">
        <div className="formulario card-formulario">
          <div className="title">
            <h1>Crie sua conta</h1>
            <p>Já possui uma conta? Entre <Link to="/Login">aqui</Link>.</p>
          </div>
          <div className="conta">
            <h4>Email *</h4>
            <input type="email" placeholder="Insira seu email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <h4>Nome Completo *</h4>
            <input type="text" placeholder="Insira seu nome" value={nome} onChange={(e) => setNome(e.target.value)} />
            <h4>Senha *</h4>
            <input type="password" placeholder="Crie uma senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
            <button type="button" onClick={handleCriarConta}>Criar Conta</button>
            {erro && <p className="erro">{erro}</p>}
          </div>
          <div className="outrologin">
            <p>Ou faça login com</p>
            <div className="img">
              <button onClick={handleLoginGoogle}>
                <img src={gmail} alt="Login com Google" />
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
    </Layout>
  );
}

export default CriarContaPage;
