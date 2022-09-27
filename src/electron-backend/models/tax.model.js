// For creating tax database
//dependencies = user,unit,tax

module.exports = (sequelize, Sequelize) => {
  const Tax = sequelize.define("tax", {
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
        msg: "This tax name already exists.",
      },
    },
  });
  return Tax;
};
