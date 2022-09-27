// For creating subgroup database
//dependencies = group,user

module.exports = (sequelize, Sequelize) => {
  const SubGroup = sequelize.define("subgroups", {
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
        msg: 'This subgroup name already exists.'
      },
    },
    group_id: {
      type: Sequelize.INTEGER,
      references: { model: "groups", key: "value" },
      onDelete: "CASCADE",
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
  return SubGroup;
};
