// For creating BankLedger database
//dependencies = user

module.exports = (sequelize, Sequelize) => {
  const BankLedger = sequelize.define("bank_ledger", {
    value: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    bank_id: {
      type: Sequelize.INTEGER,
      references: { model: "banks", key: "value" },
      onDelete: "CASCADE",
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
  return BankLedger;
};
