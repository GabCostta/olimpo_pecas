
const calculateDiscount = (totalAmount, discountCode) => {
    const discounts = {
        'DESC10': 0.1,
        'DESC20': 0.2,
        'DESC30': 0.3,
    };

    const discountRate = discounts[discountCode] || 0;
    return totalAmount * discountRate;
};

module.exports = { calculateDiscount };