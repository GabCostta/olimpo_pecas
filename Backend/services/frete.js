
const calculateShipping = (distance, weight) => {
    const baseRate = 5.0; // Taxa base
    const ratePerKm = 0.1; // Taxa por km
    const ratePerKg = 0.5; // Taxa por kg

    return baseRate + (distance * ratePerKm) + (weight * ratePerKg);
};

module.exports = { calculateShipping };