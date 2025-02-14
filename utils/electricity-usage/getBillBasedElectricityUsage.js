const { stateTariff, nationalAvgTariff } = require("../../data/stateTariffs");

const getBillBasedElectricityUsage = ({ billAmount, state, unitPrice }) => {

    if (!billAmount || billAmount <= 0) {
        throw new Error("Enter valid details");
    }

    let effectiveUnitPrice = unitPrice || stateTariff[state] || nationalAvgTariff;

    const estimatedUsage = billAmount / effectiveUnitPrice;

    return estimatedUsage.toFixed(2);
};

module.exports = getBillBasedElectricityUsage;
