
const calculaFrete = (distancia, peso) => {
    const taxaBase = 5.0; 
    const taxaPorKm = 0.1; 
    const taxaPorKg = 0.5; 

    return taxaBase + (distancia * taxaPorKm) + (peso * taxaPorKg);
};

module.exports = { calculaFrete };