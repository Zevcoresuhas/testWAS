// For creating order database
//dependencies = user,customer

module.exports = (sequelize, Sequelize) => {
  const Passbook = sequelize.define("passbook", {
    value: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: Sequelize.DATE,
    },
    sale: {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    },
    expense: {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    },
    income: {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    },
    balance: {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    },
  });
  return Passbook;
};
