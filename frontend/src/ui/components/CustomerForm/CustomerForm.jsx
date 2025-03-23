import React, { useState } from "react";
import "@styles/Components/CustomerForm/CustomerForm.css";

function CustomerForm() {
  const [customer, setCustomer] = useState({
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
    setCustomer({
      ...customer,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode enviar os dados para o backend ou salvar localmente
    console.log("Cliente cadastrado:", customer);
  };

  return (
    <form onSubmit={handleSubmit} className="customer-form">
      <h2>Cadastro de Cliente</h2>
      <label>
        Nome Completo:
        <input
          type="text"
          name="nome"
          value={customer.nome}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={customer.email}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        CPF:
        <input
          type="text"
          name="cpf"
          value={customer.cpf}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Celular:
        <input
          type="text"
          name="celular"
          value={customer.celular}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Endereço:
        <input
          type="text"
          name="endereco"
          value={customer.endereco}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Bairro:
        <input
          type="text"
          name="bairro"
          value={customer.bairro}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Cidade:
        <input
          type="text"
          name="cidade"
          value={customer.cidade}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        CEP:
        <input
          type="text"
          name="cep"
          value={customer.cep}
          onChange={handleChange}
          required
        />
      </label>
      <button type="submit">Cadastrar</button>
    </form>
  );
}

export default CustomerForm;
