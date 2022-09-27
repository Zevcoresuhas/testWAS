// For creating cashLedger database
//dependencies = user

module.exports = (sequelize, Sequelize) => {
  const CashLedger = sequelize.define("cash_ledger", {
    value: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    label: {
      type: Sequelize.STRING,
    },
    date: {
      type: Sequelize.DATE,
    },
    transaction_type: {
      type: Sequelize.STRING,
    },
    amount: {
      type: Sequelize.STRING,
    },
  });
  return CashLedger;
};
