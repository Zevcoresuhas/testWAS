// For creating sale_type database
//dependencies = user,unit,sale_type

module.exports = (sequelize, Sequelize) => {
  const SaleType = sequelize.define("sale_type", {
    value: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    label: {
      type: Sequelize.STRING,
      unique: {
        arg: true,
        msg: "This sale type name already exists.",
      },
    },
  });
  return SaleType;
};
