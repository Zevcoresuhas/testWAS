const routes = {};

routes.extra = require("./extra.routes");
routes.auth = require("./auth.routes");
routes.tax = require("./tax.routes");
routes.sale_type = require("./sale_type.route");
routes.account = require("./account.routes");
routes.user = require("./user.routes");
routes.bank = require("./bank.routes");
routes.address = require("./address.routes");

routes.brand = require("./brand.routes");
routes.group = require("./group.route");
routes.subgroup = require("./subgroup.routes");
routes.product = require("./product.routes");

routes.vendor = require("./vendor.routes");
routes.po = require("./po.routes");
routes.stock = require("./stock.routes");

routes.customer = require("./customer.routes");
routes.invoice = require("./invoice.routes");
routes.estimate = require("./estimate.routes");
routes.payment = require("./payment.routes");

routes.report = require("./report.routes");
routes.cash_leadger = require("./cash_leadger.routes");
routes.bank_ledger = require("./bank_ledger.routes");
routes.reminder = require("./reminder.routes");
module.exports = routes;
