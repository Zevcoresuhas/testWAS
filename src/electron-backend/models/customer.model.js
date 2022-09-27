// For creating customers database
//dependencies = user

module.exports = (sequelize, Sequelize) => {
  const Customer = sequelize.define("customers", {
    value: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    label: {
      type: Sequelize.STRING,
    },
    phone_number: {
      type: Sequelize.STRING,
      unique: {
        arg: true,
        msg: "This phone number already exists.",
      },
    },
    gstin: {
      type: Sequelize.STRING,
    },
    credit_limit: {
      type: Sequelize.BIGINT,
    },
    pending_credit: {
      type: Sequelize.BIGINT,
      defaultValue: 0,
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
  return Customer;
};
