import React, { useState } from "react";
import "@styles/Components/ProductForm/ProductForm.css";

function ProductForm() {
  const [product, setProduct] = useState({
    titulo: "",
    descricao: "",
    valorantigo: "",
    valoratual: "",
    foto: "",
    desconto: false,
    valordesconto: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({
      ...product,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode enviar os dados para o backend ou salvar localmente
    console.log("Produto criado:", product);
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h2>Criar Novo Produto</h2>
      <label>
        Título:
        <input
          type="text"
          name="titulo"
          value={product.titulo}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Descrição:
        <textarea
          name="descricao"
          value={product.descricao}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Valor Antigo:
        <input
          type="number"
          name="valorantigo"
          value={product.valorantigo}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Valor Atual:
        <input
          type="number"
          name="valoratual"
          value={product.valoratual}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Foto (URL):
        <input
          type="text"
          name="foto"
          value={product.foto}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Desconto:
        <input
          type="checkbox"
          name="desconto"
          checked={product.desconto}
          onChange={handleChange}
        />
      </label>
      {product.desconto && (
        <label>
          Valor do Desconto:
          <input
            type="number"
            name="valordesconto"
            value={product.valordesconto}
            onChange={handleChange}
          />
        </label>
      )}
      <button type="submit">Criar Produto</button>
    </form>
  );
}

export default ProductForm;
