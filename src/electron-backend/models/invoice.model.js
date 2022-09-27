// For creating invoice database
//dependencies = none

module.exports = (sequelize, Sequelize) => {
  const Invoice = sequelize.define("invoices", {
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
    address: {
      type: Sequelize.STRING,
    },
    terms_of_delivery: {
      type: Sequelize.STRING,
    },
    remark: {
      type: Sequelize.STRING,
    },
    destination: {
      type: Sequelize.STRING,
    },
    despatched_through: {
      type: Sequelize.STRING,
    },
    delivery_note_date: {
      type: Sequelize.STRING,
    },
    despatch_doc_no: {
      type: Sequelize.STRING,
    },
    dated: {
      type: Sequelize.STRING,
    },
    buyer_order_no: {
      type: Sequelize.STRING,
    },
    other_ref: {
      type: Sequelize.STRING,
    },
    suppliers_ref: {
      type: Sequelize.STRING,
    },
    deliver_note: {
      type: Sequelize.STRING,
    },
    bank_name: {
      type: Sequelize.STRING,
    },
    delete: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  });
  return Invoice;
};
