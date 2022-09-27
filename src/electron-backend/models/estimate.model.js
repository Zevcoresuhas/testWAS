// For creating estimate database
//dependencies = none

module.exports = (sequelize, Sequelize) => {
  const Estimate = sequelize.define("estimate", {
    value: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    estimate_number: {
      type: Sequelize.STRING,
    },
    payment_type_id: {
      type: Sequelize.STRING,
    },
    bill_type: {
      type: Sequelize.STRING,
    },
    estimate_date: {
      type: Sequelize.DATE,
    },
    customer_id: {
      type: Sequelize.STRING,
    },
    discount: {
      type: Sequelize.STRING,
    },
    sub_total: {
      type: Sequelize.STRING,
    },

    total: {
      type: Sequelize.STRING,
    },
    total_items: {
      type: Sequelize.BIGINT,
    },
    paid: {
      type: Sequelize.STRING,
    },
    balance: {
      type: Sequelize.STRING,
    },

    delete: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  });
  return Estimate;
};
