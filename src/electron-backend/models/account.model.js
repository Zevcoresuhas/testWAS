// For creating account database
//dependencies = user

module.exports = (sequelize, Sequelize) => {
  const Account = sequelize.define("account", {
    value: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    label: {
      type: Sequelize.STRING,
    },
    company_name: {
      type: Sequelize.STRING,
    },
    gstin: {
      type: Sequelize.STRING,
    },
    phone_number: {
      type: Sequelize.STRING,
    },
    cin: {
      type: Sequelize.STRING,
    },
    door: {
      type: Sequelize.STRING,
    },
    street: {
      type: Sequelize.STRING,
    },
    locality: {
      type: Sequelize.STRING,
    },
    pincode: {
      type: Sequelize.STRING,
    },
    city: {
      type: Sequelize.STRING,
    },
    state: {
      type: Sequelize.STRING,
    },
    logo: {
      type: Sequelize.STRING,
    },
    stock_prefix: {
      type: Sequelize.STRING,
    },
    added_by: {
      type: Sequelize.STRING,
    },
  });
  return Account;
};
