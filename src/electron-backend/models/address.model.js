// For creating bank database
//dependencies = user,unit,tax

module.exports = (sequelize, Sequelize) => {
  const Address = sequelize.define("address", {
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
        msg: "This address name already exists.",
      },
    },
    phone_number: {
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
  });
  return Address;
};
