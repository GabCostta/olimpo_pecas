import React, { useState } from 'react';
import "@styles/pages/SellerForm/SellerForm.css";
import Layout from "@components/Layout/Layout.jsx";

function SellerForm() {
  const [seller, setSeller] = useState({
    nome: "",
    email: "",
    cpf: "",
    celular: "",
    endereco: "",
    bairro: "",
    cidade: "",
    cep: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSeller({
      ...seller,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Cadastro de Vendedor:", seller);
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit} className="seller-form">
        <h2>Cadastro de Vendedor</h2>
        <label>
          Nome Completo:
          <input
            type="text"
            name="nome"
            value={seller.nome}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={seller.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          CPF:
          <input
            type="text"
            name="cpf"
            value={seller.cpf}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Celular:
          <input
            type="text"
            name="celular"
            value={seller.celular}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Endereço:
          <input
            type="text"
            name="endereco"
            value={seller.endereco}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Bairro:
          <input
            type="text"
            name="bairro"
            value={seller.bairro}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Cidade:
          <input
            type="text"
            name="cidade"
            value={seller.cidade}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          CEP:
          <input
            type="text"
            name="cep"
            value={seller.cep}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Cadastrar</button>
      </form>
    </Layout>
  );
}

export default SellerForm;
