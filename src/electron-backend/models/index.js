const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db/db.sqlite3",
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import user model relation users
db.user = require("./user.model.js")(sequelize, Sequelize);
db.user.belongsTo(db.user, {
  foreignKey: "added_by",
  as: "added_user",
});
db.user.belongsTo(db.user, {
  foreignKey: "updated_by",
  as: "updated_user",
});

// Import tax model relation user
db.tax = require("./tax.model")(sequelize, Sequelize);

// Import sale type model relation user
db.sale_type = require("./sale_type.model")(sequelize, Sequelize);

// Import sale type model relation user
db.account = require("./account.model")(sequelize, Sequelize);

// Import brand model relation user
db.brand = require("./brand.model")(sequelize, Sequelize);
db.brand.belongsTo(db.user, {
  foreignKey: "added_by",
  as: "added_user",
});
db.brand.belongsTo(db.user, {
  foreignKey: "updated_by",
  as: "updated_user",
});

// Import group model relation user
db.group = require("./group.model")(sequelize, Sequelize);
db.group.belongsTo(db.user, {
  foreignKey: "added_by",
  as: "added_user",
});
db.group.belongsTo(db.user, {
  foreignKey: "updated_by",
  as: "updated_user",
});

// Import subgroup model relation group, user
db.subgroup = require("./subgroup.model")(sequelize, Sequelize);
db.subgroup.belongsTo(db.group, {
  foreignKey: "group_id",
});
db.subgroup.belongsTo(db.user, {
  foreignKey: "added_by",
  as: "added_user",
});
db.subgroup.belongsTo(db.user, {
  foreignKey: "updated_by",
  as: "updated_user",
});

// Import product with relations
db.product = require("./product.model")(sequelize, Sequelize);
db.product.belongsTo(db.group, {
  foreignKey: "group_id",
});
db.product.belongsTo(db.subgroup, {
  foreignKey: "subgroup_id",
});
db.product.belongsTo(db.brand, {
  foreignKey: "brand_id",
});
db.product.belongsTo(db.user, {
  foreignKey: "added_by",
  as: "added_user",
});
db.product.belongsTo(db.user, {
  foreignKey: "updated_by",
  as: "updated_user",
});

// Import bank data
db.bank = require("../models/bank.model")(sequelize, Sequelize);

// Import bank data
db.address = require("../models/address.model")(sequelize, Sequelize);

// Import vendor model relation user
db.vendor = require("./vendor.model")(sequelize, Sequelize);
db.vendor.belongsTo(db.user, {
  foreignKey: "added_by",
  as: "added_user",
});
db.vendor.belongsTo(db.user, {
  foreignKey: "updated_by",
  as: "updated_user",
});

// For export po data list with foreign key
db.po = require("../models/po.model")(sequelize, Sequelize);
db.po.belongsTo(db.vendor, {
  foreignKey: "vendor_id",
});
db.po.belongsTo(db.user, {
  foreignKey: "added_by",
  as: "added_user",
});
db.po.belongsTo(db.user, {
  foreignKey: "updated_by",
  as: "updated_user",
});

// For export po_list data list with foreign key
db.po_list = require("../models/po_list.model")(sequelize, Sequelize);

db.po.hasMany(db.po_list, {
  foreignKey: "po_id",
});
db.po_list.belongsTo(db.po, {
  foreignKey: "po_id",
});

db.po_list.belongsTo(db.product, {
  foreignKey: "product_id",
});
db.po_list.belongsTo(db.group, {
  foreignKey: "group_id",
});
db.po_list.belongsTo(db.subgroup, {
  foreignKey: "subgroup_id",
});
db.po_list.belongsTo(db.brand, {
  foreignKey: "brand_id",
});

db.stock = require("../models/stock.model")(sequelize, Sequelize);
db.stock.belongsTo(db.product, {
  foreignKey: "product_id",
});

db.product.hasMany(db.stock, {
  foreignKey: "product_id",
});
db.stock.belongsTo(db.product, {
  foreignKey: "product_id",
});

db.customer = require("../models/customer.model")(sequelize, Sequelize);

db.invoice = require("../models/invoice.model")(sequelize, Sequelize);
db.invoice_item = require("../models/invoice_item.model")(sequelize, Sequelize);
db.invoice.hasMany(db.invoice_item, {
  foreignKey: "invoice_id",
});
db.invoice_item.belongsTo(db.invoice, {
  foreignKey: "invoice_id",
});

db.estimate = require("../models/estimate.model")(sequelize, Sequelize);
db.estimate_item = require("../models/estimate_item.model")(
  sequelize,
  Sequelize
);
db.estimate.hasMany(db.estimate_item, {
  foreignKey: "invoice_id",
});
db.estimate_item.belongsTo(db.estimate, {
  foreignKey: "invoice_id",
});
db.cash_ledger = require("../models/cash_ledger.model")(sequelize, Sequelize);

db.bank_ledger = require("../models/bank_ledger.model")(sequelize, Sequelize);
db.bank_ledger.belongsTo(db.bank, {
  foreignKey: "bank_id",
});

db.reminder = require("../models/reminder.model")(sequelize, Sequelize);

db.saveInvoice = require("../models/saveInvoice.model")(sequelize, Sequelize);
db.saveInvoice_item = require("../models/saveInvoice_item.model")(
  sequelize,
  Sequelize
);
db.saveInvoice.hasMany(db.saveInvoice_item, {
  foreignKey: "invoice_id",
});
db.saveInvoice_item.belongsTo(db.saveInvoice, {
  foreignKey: "invoice_id",
});
db.saveInvoice_item.belongsTo(db.product, {
  foreignKey: "product_id",
});
db.passbook = require("../models/passbook.model")(sequelize, Sequelize);

db.payments = require("../models/payments.model")(sequelize, Sequelize);
db.journal = require("../models/journal.model")(sequelize, Sequelize);
const queryInterface = sequelize.getQueryInterface();
// queryInterface.addColumn("products", "stock_depletion", {
//   type: Sequelize.BIGINT,
// });

// queryInterface.addColumn("invoices", "bank_name", {
//   type: Sequelize.STRING,
// });
module.exports = db;
