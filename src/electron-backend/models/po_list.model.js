// For creating invoice database
//dependencies = none

module.exports = (sequelize, Sequelize) => {
  const PoList = sequelize.define("po_list", {
    value: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    po_id: {
      type: Sequelize.INTEGER,
      references: { model: "purchase_orders", key: "value" },
      onDelete: "CASCADE",
    },
    product_id: {
      type: Sequelize.INTEGER,
      references: { model: "products", key: "value" },
      onDelete: "CASCADE",
    },
    group_id: {
      type: Sequelize.INTEGER,
      references: { model: "groups", key: "value" },
      onDelete: "CASCADE",
    },
    subgroup_id: {
      type: Sequelize.INTEGER,
      references: { model: "subgroups", key: "value" },
      onDelete: "CASCADE",
    },
    brand_id: {
      type: Sequelize.INTEGER,
      references: { model: "brands", key: "value" },
      onDelete: "CASCADE",
    },

    total_item: {
      type: Sequelize.STRING,
    },
    date: {
      type: Sequelize.DATE,
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  });
  return PoList;
};
