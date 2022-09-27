// For creating invoice_item database
//dependencies = none

module.exports = (sequelize, Sequelize) => {
  const InvoiceItem = sequelize.define("invoice_item", {
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
    barcode: {
      type: Sequelize.STRING,
    },
    invoice_date: {
      type: Sequelize.DATE,
    },
    product_name: {
      type: Sequelize.STRING,
    },
    group_name: {
      type: Sequelize.STRING,
    },
    subgroup_name: {
      type: Sequelize.STRING,
    },
    hsn: {
      type: Sequelize.STRING,
    },
    tax_rate: {
      type: Sequelize.STRING,
    },
    tax: {
      type: Sequelize.STRING,
    },
    rate: {
      type: Sequelize.STRING,
    },
    count: {
      type: Sequelize.BIGINT,
    },
    amount: {
      type: Sequelize.STRING,
    },
    delete: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  });
  return InvoiceItem;
};
