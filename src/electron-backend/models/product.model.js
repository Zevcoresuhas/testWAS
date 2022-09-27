// For creating product database
//dependencies = user,group,subgroup

module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("product", {
    value: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    image: {
      type: Sequelize.STRING,
      defaultValue: "product.png",
    },
    label: {
      type: Sequelize.STRING,
      unique: {
        arg: true,
        msg: "This product name already exists.",
      },
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
    sku: {
      type: Sequelize.STRING,
      unique: {
        arg: true,
        msg: "This sku name already exists.",
      },
    },
    hsn: {
      type: Sequelize.STRING,
    },
    price: {
      type: Sequelize.BIGINT,
    },
    type: {
      type: Sequelize.STRING,
    },
    tax: {
      type: Sequelize.BIGINT,
    },
    stock_depletion: {
      type: Sequelize.BIGINT,
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
  return Product;
};
