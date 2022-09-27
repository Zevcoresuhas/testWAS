// For creating users database
//dependencies = user

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    value: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    label: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    phone_number: {
      type: Sequelize.BIGINT,
    },
    image: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    token: {
      type: Sequelize.STRING,
    },
    role: {
      type: Sequelize.STRING,
    },
    deviceId: {
      type: Sequelize.STRING,
    },
    userKey: {
      type: Sequelize.STRING,
    },
    brand: {
      type: Sequelize.STRING,
    },
    brands: {
      type: Sequelize.STRING,
    },
    brandCheck: {
      type: Sequelize.BOOLEAN,
    },
    group: {
      type: Sequelize.STRING,
    },
    groups: {
      type: Sequelize.STRING,
    },
    groupCheck: {
      type: Sequelize.BOOLEAN,
    },
    subgroup: {
      type: Sequelize.STRING,
    },
    subgroups: {
      type: Sequelize.STRING,
    },
    subgroupCheck: {
      type: Sequelize.BOOLEAN,
    },
    product: {
      type: Sequelize.STRING,
    },
    products: {
      type: Sequelize.STRING,
    },
    type: {
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
  return User;
};
