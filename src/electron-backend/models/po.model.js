// For creating invoice database
//dependencies = none

module.exports = (sequelize, Sequelize) => {
  const PurchaseOrder = sequelize.define("purchase_order", {
    value: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    vendor_id: {
      type: Sequelize.INTEGER,
      references: { model: "vendors", key: "value" },
      onDelete: "CASCADE",
    },
    po_number: {
      type: Sequelize.STRING,
    },
    date: {
      type: Sequelize.DATE,
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    added_by: {
      type: Sequelize.INTEGER,
      references: { model: "users", key: "value" },
      onDelete: "CASCADE",
    },
    updated_by: {
      type: Sequelize.INTEGER,
      references: { model: "users", key: "value" },
      onDelete: "CASCADE",
    },
  });
  return PurchaseOrder;
};
