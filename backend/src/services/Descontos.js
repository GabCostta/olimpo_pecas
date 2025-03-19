const calculaDescontos = (valorTotal, codigoDesconto) => {
    const descontos = {
        'DESC10': 0.1,
        'DESC20': 0.2,
        'DESC30': 0.3,
    };

    const taxaDesconto = descontos[codigoDesconto] || 0;
    return valorTotal * taxaDesconto;
};

module.exports = { calculaDescontos };
