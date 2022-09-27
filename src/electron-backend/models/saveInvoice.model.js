// For creating invoice database
//dependencies = none

module.exports = (sequelize, Sequelize) => {
  const SaveInvoice = sequelize.define("saveInvoices", {
    value: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    invoice_number: {
      type: Sequelize.STRING,
    },
    payment_type_id: {
      type: Sequelize.STRING,
    },
    bill_type: {
      type: Sequelize.STRING,
    },
    invoice_date: {
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
    cgst: {
      type: Sequelize.STRING,
    },
    sgst: {
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
  return SaveInvoice;
};
