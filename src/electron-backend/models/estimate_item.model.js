// For creating estimate_item database
//dependencies = none

module.exports = (sequelize, Sequelize) => {
  const EstimateItem = sequelize.define("estimate_item", {
    value: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    estimate_id: {
      type: Sequelize.INTEGER,
      references: { model: "estimates", key: "value" },
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
  return EstimateItem;
};
