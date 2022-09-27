// For creating vendor database
//dependencies = user

module.exports = (sequelize, Sequelize) => {
  const Vendor = sequelize.define("vendor", {
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
        msg: "This subgroup name already exists.",
      },
    },
    phone_number: {
      type: Sequelize.STRING,
      unique: {
        arg: true,
        msg: "This phone number already exists.",
      },
    },
    phone_number2: {
      type: Sequelize.STRING,
    },
    gstin: {
      type: Sequelize.STRING,
      unique: {
        arg: true,
        msg: "This GSTIN already exists.",
      },
    },
    door_no: {
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
  return Vendor;
};
