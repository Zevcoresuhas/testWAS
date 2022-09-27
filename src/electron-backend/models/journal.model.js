// For creating invoice_item database
//dependencies = none

module.exports = (sequelize, Sequelize) => {
  const Journal = sequelize.define("journal", {
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
    customer_id: {
      type: Sequelize.STRING,
    },
    date: {
      type: Sequelize.DATE,
    },
    amount: {
      type: Sequelize.STRING,
    },
  });
  return Journal;
};
