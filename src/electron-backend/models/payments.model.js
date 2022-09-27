// For creating invoice_item database
//dependencies = none

module.exports = (sequelize, Sequelize) => {
  const Payment = sequelize.define("payment", {
    value: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    invoice_id: {
      type: Sequelize.INTEGER,
      references: { model: "invoices", key: "value" },
      onDelete: "CASCADE",
    },
    payment_mode: {
      type: Sequelize.STRING,
    },
    customer_id: {
      type: Sequelize.STRING,
    },
    date: {
      type: Sequelize.DATE,
    },
    amount_paid: {
      type: Sequelize.STRING,
    },
  });
  return Payment;
};
