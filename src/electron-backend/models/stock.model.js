// For creating item database
//dependencies = user,group,subgroup,hallmark,design,size

module.exports = (sequelize, Sequelize) => {
  const Stock = sequelize.define("stock", {
    value: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    invoice_id: {
      type: Sequelize.STRING,
    },
    vendor: {
      type: Sequelize.STRING,
    },
    product_id: {
      type: Sequelize.INTEGER,
      references: { model: "products", key: "value" },
      onDelete: "CASCADE",
    },
    sku: {
      type: Sequelize.STRING,
    },
    hsn: {
      type: Sequelize.STRING,
    },
    barcode: {
      type: Sequelize.STRING,
      unique: {
        arg: true,
        msg: "This barcode already exists.",
      },
    },
    date: {
      type: Sequelize.DATE,
    },
    invoice_no: {
      type: Sequelize.STRING,
    },
    total_item: {
      type: Sequelize.STRING,
    },
    reaming_item: {
      type: Sequelize.STRING,
    },
    cost_per_item: {
      type: Sequelize.STRING,
    },
    total: {
      type: Sequelize.STRING,
    },
  });
  return Stock;
};
