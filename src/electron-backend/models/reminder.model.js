// For creating repair database
//dependencies = user

module.exports = (sequelize, Sequelize) => {
  const Reminder = sequelize.define("reminder", {
    value: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: Sequelize.DATE,
    },
    time: {
      type: Sequelize.DATE,
    },
    reminder: {
      type: Sequelize.STRING,
    },
  });
  return Reminder;
};
