// For creating brand database
//dependencies = user,unit,tax

module.exports = (sequelize, Sequelize) => {
  const Brand = sequelize.define("brand", {
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
        msg: "This brand name already exists.",
      },
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
  return Brand;
};
