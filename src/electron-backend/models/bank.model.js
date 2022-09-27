// For creating bank database
//dependencies = user,unit,tax

module.exports = (sequelize, Sequelize) => {
  const Bank = sequelize.define("bank", {
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
        msg: "This bank name already exists.",
      },
    },
    account_no: {
      type: Sequelize.STRING,
    },
    ifsc: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
    },
    branch: {
      type: Sequelize.STRING,
    },
    amount: {
      type: Sequelize.STRING,
    },
  });
  return Bank;
};
