const { ipcMain, Notification, BrowserWindow } = require("electron");

const db = require("../models");
const Op = db.Sequelize.Op;

ipcMain.on("asynchronous-customer-report", async (event, arg) => {
  try {
    const get = await db.invoice
      .findAll({
        raw: true,
        group: ["customer_id"],
        attributes: [
          "customer_id",
          [
            db.sequelize.fn("sum", db.sequelize.col("total_items")),
            "max_count",
          ],
          [db.sequelize.fn("sum", db.sequelize.col("total")), "max_amount"],
        ],
        order: [["total_items", "ASC"]],
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-customer-report-reply", dataR);
      })
      .catch((err) => {
        event.reply("asynchronous-customer-report-reply", err);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-customer-report-reply", dataR);
  }
});

ipcMain.on("asynchronous-hsn-report", async (event, arg) => {
  try {
    const get = await db.invoice_item
      .findAll({
        raw: true,
        group: ["hsn"],
        attributes: [
          "hsn",
          [db.sequelize.fn("sum", db.sequelize.col("count")), "max_count"],
          [db.sequelize.fn("sum", db.sequelize.col("amount")), "max_amount"],
        ],
        order: [["total_items", "ASC"]],
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-hsn-report-reply", dataR);
      })
      .catch((err) => {
        event.reply("asynchronous-hsn-report-reply", err);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-hsn-report-reply", dataR);
  }
});

ipcMain.on("asynchronous-kpi-report", async (event, arg) => {
  try {
    //get curent date year
    var date = new Date(); //preset date
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1); //get first day of the year
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0); //get last date date of the year
    var halfDay = new Date(date.getFullYear(), 6, 0); //get Half year date
    var qtyDay = new Date(date.getFullYear(), 3, 0); //Get 1/4 year date
    const TODAY_START = new Date().setHours(0, 0, 0, 0); //get today starting tme
    const NOW = new Date(); // get time now

    // Get all the invoice of this years
    const year_data = await db.invoice_item.findAll({
      raw: true,
      where: db.sequelize.where(
        db.sequelize.fn("strftime", "%Y", db.sequelize.col("invoice_date")),
        date.getFullYear().toString()
      ),
    });

    //Get all the invoice of half years
    const half_year = await db.invoice_item.findAll({
      raw: true,
      where: {
        invoice_date: {
          [Op.gt]: firstDay,
          [Op.lt]: halfDay,
        },
      },
    });
    //get allt he invoice of 1/4 years
    const qty_data = await db.invoice_item.findAll({
      raw: true,
      where: {
        invoice_date: {
          [Op.gt]: firstDay,
          [Op.lt]: qtyDay,
        },
      },
    });
    //get curent month of invoices
    const month_data = await db.invoice_item.findAll({
      raw: true,
      where: {
        invoice_date: {
          [Op.gt]: firstDay,
          [Op.lt]: lastDay,
        },
      },
    });
    //get today invoices list only
    const daily = await db.invoice_item.findAll({
      raw: true,
      where: {
        invoice_date: {
          [Op.gt]: TODAY_START,
          [Op.lt]: NOW,
        },
      },
    });
    Promise.all([year_data, half_year, qty_data, month_data, daily])
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-kpi-report-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-kpi-report-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-kpi-report-reply", dataR);
  }
});

ipcMain.on("asynchronous-dashboard-report", async (event, arg) => {
  try {
    //get curent date year
    var date = new Date(); //preset date
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1); //get first day of the year
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0); //get last date date of the year

    // Get all the invoice of this years
    const total_sale = await db.invoice.count({
      raw: true,
      where: {
        invoice_date: {
          [Op.gt]: firstDay,
          [Op.lt]: lastDay,
        },
      },
    });

    const total_amount_sale = await db.invoice.findAll({
      raw: true,
      where: {
        invoice_date: {
          [Op.gt]: firstDay,
          [Op.lt]: lastDay,
        },
      },
      attributes: [
        [db.sequelize.fn("sum", db.sequelize.col("paid")), "max_amount"],
      ],
    });

    const total_product_sold = await db.invoice_item.findAll({
      raw: true,
      where: {
        invoice_date: {
          [Op.gt]: firstDay,
          [Op.lt]: lastDay,
        },
      },
      attributes: [
        [db.sequelize.fn("sum", db.sequelize.col("count")), "max_count"],
      ],
    });

    const total_customer = await db.invoice_item.count({
      where: {
        invoice_date: {
          [Op.gt]: firstDay,
          [Op.lt]: lastDay,
        },
      },
    });

    const cash_expense = await db.cash_ledger.findAll({
      raw: true,
      where: {
        date: {
          [Op.gt]: firstDay,
          [Op.lt]: lastDay,
        },
        transaction_type: "Expense",
      },
      attributes: [
        [db.sequelize.fn("sum", db.sequelize.col("amount")), "max_count"],
      ],
    });
    const cash_income = await db.cash_ledger.findAll({
      raw: true,
      where: {
        date: {
          [Op.gt]: firstDay,
          [Op.lt]: lastDay,
        },
        transaction_type: "Income",
      },
      attributes: [
        [db.sequelize.fn("sum", db.sequelize.col("amount")), "max_count"],
      ],
    });
    const invoice_list = await db.invoice.findAll({
      raw: true,
      where: db.sequelize.where(
        db.sequelize.fn("strftime", "%Y", db.sequelize.col("invoice_date")),
        date.getFullYear().toString()
      ),
      order: [["invoice_date", "ASC"]],
    });

    const stockCheck = await db.stock.findAll({
      raw: true,
      nest: true,
      group: ["product_id"],
      attributes: [
        [
          db.sequelize.fn("sum", db.sequelize.col("reaming_item")),
          "total_item",
        ],
      ],
      include: [
        {
          model: db.product,
          required: false,
        },
      ],
    });

    var depletion = 0;
    var product = [];
    for (let a = 0; a < stockCheck.length; a++) {
      if (stockCheck[a].total_item < stockCheck[a].product.stock_depletion) {
        depletion += 1;
        product.push(stockCheck[a].product);
      }
    }
    const product_depletion = {
      depletion: depletion,
      product: product,
    };

    Promise.all([
      total_sale,
      total_amount_sale,
      total_product_sold,
      total_customer,
      cash_expense,
      cash_income,
      invoice_list,
      product_depletion,
    ])
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-dashboard-report-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-dashboard-report-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-dashboard-report-reply", dataR);
  }
});

ipcMain.on("asynchronous-stock-depletion", async (event, arg) => {
  try {
    const stockCheck = await db.stock.findAll({
      raw: true,
      nest: true,
      group: ["product_id"],
      attributes: [
        [
          db.sequelize.fn("sum", db.sequelize.col("reaming_item")),
          "total_item",
        ],
      ],
      include: [
        {
          model: db.product,
          required: false,
        },
      ],
    });

    var depletion = 0;
    var product = [];
    for (let a = 0; a < stockCheck.length; a++) {
      if (stockCheck[a].total_item < stockCheck[a].product.stock_depletion) {
        depletion += 1;
        product.push(stockCheck[a].product);
      }
    }
    const product_depletion = {
      depletion: depletion,
      product: product,
    };

    Promise.all(stockCheck)
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-stock-depletion-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-stock-depletion-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-stock-depletion-reply", dataR);
  }
});

ipcMain.on("asynchronous-product-history", async (event, arg) => {
  try {
    const product = await db.product.findByPk(arg);
    const invoice_list = await db.invoice_item.findAll({
      raw: true,
      nest: true,
      where: { product_name: product.label },
      group: ["invoice_id"],
      include: [
        {
          model: db.invoice,
          required: false,
        },
      ],
    });
    const total = await db.invoice_item.findAll({
      raw: true,
      nest: true,
      where: { product_name: product.label },

      attributes: [
        [db.sequelize.fn("sum", db.sequelize.col("count")), "total_item"],
        [db.sequelize.fn("sum", db.sequelize.col("amount")), "total_amount"],
        [db.sequelize.fn("sum", db.sequelize.col("tax_rate")), "total_tax"],
      ],
    });

    const total_stock = await db.stock.findAll({
      raw: true,

      where: { product_id: arg },

      attributes: [
        [db.sequelize.fn("sum", db.sequelize.col("total_item")), "total_stock"],
        [
          db.sequelize.fn("sum", db.sequelize.col("total")),
          "total_stock_amount",
        ],
        [
          db.sequelize.fn("sum", db.sequelize.col("reaming_item")),
          "total_reaming",
        ],
        [
          db.sequelize.fn(
            "sum",
            db.sequelize.literal("(cost_per_item * reaming_item)")
          ),
          "total_amount",
        ],
      ],
    });

    const stocks = await db.stock.findAll({
      raw: true,

      where: { product_id: arg },
    });

    const months = await db.invoice_item.findAll({
      raw: true,
      nest: true,
      where: { product_name: product.label },
      attributes: [
        "amount",
        "invoice_date",
        [
          db.sequelize.fn("strftime", "%m", db.sequelize.col("invoice_date")),
          "month",
        ],
        [db.sequelize.fn("sum", db.sequelize.col("amount")), "total_amount"],
      ],
      group: ["month"],
    });

    Promise.all([invoice_list, total, stocks, total_stock, months])
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-product-history-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-product-history-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-product-history-reply", dataR);
  }
});

ipcMain.on("asynchronous-product-history-date", async (event, arg) => {
  try {
    var from_date = new Date(arg.from);
    var to_date = new Date(arg.to);
    from_date = new Date(
      from_date.getFullYear(),
      from_date.getMonth(),
      from_date.getDate(),
      0,
      0,
      0,
      0
    );
    to_date = new Date(
      to_date.getFullYear(),
      to_date.getMonth(),
      to_date.getDate(),
      23,
      59,
      59,
      59
    );
    console.log(from_date, to_date);
    const product = await db.product.findByPk(arg.value);
    const invoice_list = await db.invoice_item.findAll({
      raw: true,
      nest: true,
      where: {
        product_name: product.label,
        invoice_date: {
          [Op.between]: [from_date, to_date],
        },
      },
      group: ["invoice_id"],
      include: [
        {
          model: db.invoice,
          required: false,
        },
      ],
    });
    const total = await db.invoice_item.findAll({
      raw: true,
      nest: true,
      where: {
        product_name: product.label,
        invoice_date: {
          [Op.between]: [from_date, to_date],
        },
      },

      attributes: [
        [db.sequelize.fn("sum", db.sequelize.col("count")), "total_item"],
        [db.sequelize.fn("sum", db.sequelize.col("amount")), "total_amount"],
        [db.sequelize.fn("sum", db.sequelize.col("tax_rate")), "total_tax"],
      ],
    });

    const total_stock = await db.stock.findAll({
      raw: true,

      where: {
        product_id: arg.value,
        date: {
          [Op.between]: [from_date, to_date],
        },
      },

      attributes: [
        [db.sequelize.fn("sum", db.sequelize.col("total_item")), "total_stock"],
        [
          db.sequelize.fn("sum", db.sequelize.col("total")),
          "total_stock_amount",
        ],
        [
          db.sequelize.fn("sum", db.sequelize.col("reaming_item")),
          "total_reaming",
        ],
        [
          db.sequelize.fn(
            "sum",
            db.sequelize.literal("(cost_per_item * reaming_item)")
          ),
          "total_amount",
        ],
      ],
    });
    console.log(total_stock);
    const stocks = await db.stock.findAll({
      raw: true,
      where: {
        product_id: arg.value,
        date: {
          [Op.between]: [from_date, to_date],
        },
      },
    });

    Promise.all([invoice_list, total, stocks, total_stock])
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-product-history-date-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-product-history-date-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-product-history-date-reply", dataR);
  }
});

// Get particular customer history data
ipcMain.on("asynchronous-customer-history", async (event, arg) => {
  try {
    const customer = await db.customer.findByPk(arg);
    const invoice_list = await db.invoice.findAll({
      raw: true,
      nest: true,
      where: { customer_id: customer.label },
    });
    const total = await db.invoice.findAll({
      raw: true,
      nest: true,
      where: { customer_id: customer.label },
      attributes: [
        [db.sequelize.fn("sum", db.sequelize.col("total_items")), "total_item"],
        [db.sequelize.fn("sum", db.sequelize.col("total")), "total_amount"],
        [db.sequelize.fn("sum", db.sequelize.col("cgst")), "total_tax"],
        [db.sequelize.fn("sum", db.sequelize.col("balance")), "total_balance"],
      ],
    });
    const months = await db.invoice.findAll({
      raw: true,
      nest: true,
      where: {
        customer_id: customer.label,
      },
      attributes: [
        "total_items",
        "total",
        "balance",
        "paid",
        "invoice_date",
        [
          db.sequelize.fn("strftime", "%m", db.sequelize.col("invoice_date")),
          "month",
        ],
        [db.sequelize.fn("sum", db.sequelize.col("total")), "total_amount"],
        [db.sequelize.fn("sum", db.sequelize.col("balance")), "total_balance"],
        [db.sequelize.fn("sum", db.sequelize.col("total_items")), "total_item"],
        [db.sequelize.fn("sum", db.sequelize.col("paid")), "total_paid"],
      ],
      group: ["month"],
    });

    const journal = await db.journal.findAll({
      raw: true,
      nest: true,
      where: {
        customer_id: customer.label,
      },
      attributes: [
        [db.sequelize.fn("sum", db.sequelize.col("amount")), "total_amount"],
      ],
    });
    Promise.all([invoice_list, total, months, journal])
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-customer-history-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-customer-history-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-customer-history-reply", dataR);
  }
});

// Get particular customer history data
ipcMain.on("asynchronous-customer-history2", async (event, arg) => {
  try {
    const customer = await db.customer.findOne({
      where: { label: arg },
    });
    const invoice_list = await db.invoice.findAll({
      raw: true,
      nest: true,
      where: { customer_id: customer.label },
    });
    const total = await db.invoice.findAll({
      raw: true,
      nest: true,
      where: { customer_id: customer.label },
      attributes: [
        [db.sequelize.fn("sum", db.sequelize.col("total_items")), "total_item"],
        [db.sequelize.fn("sum", db.sequelize.col("total")), "total_amount"],
        [db.sequelize.fn("sum", db.sequelize.col("cgst")), "total_tax"],
        [db.sequelize.fn("sum", db.sequelize.col("balance")), "total_balance"],
      ],
    });
    const months = await db.invoice.findAll({
      raw: true,
      nest: true,
      where: {
        customer_id: customer.label,
      },
      attributes: [
        "total_items",
        "total",
        "balance",
        "paid",
        "invoice_date",
        [
          db.sequelize.fn("strftime", "%m", db.sequelize.col("invoice_date")),
          "month",
        ],
        [db.sequelize.fn("sum", db.sequelize.col("total")), "total_amount"],
        [db.sequelize.fn("sum", db.sequelize.col("balance")), "total_balance"],
        [db.sequelize.fn("sum", db.sequelize.col("total_items")), "total_item"],
        [db.sequelize.fn("sum", db.sequelize.col("paid")), "total_paid"],
      ],
      group: ["month"],
    });

    const journal = await db.journal.findAll({
      raw: true,
      nest: true,
      where: {
        customer_id: customer.label,
      },
      attributes: [
        [db.sequelize.fn("sum", db.sequelize.col("amount")), "total_amount"],
      ],
    });
    Promise.all([invoice_list, total, months, journal])
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-customer-history-reply2", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-customer-history-reply2", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-customer-history-reply2", dataR);
  }
});

// For get the customer report in date wise history
ipcMain.on("asynchronous-customer-history-date", async (event, arg) => {
  try {
    var from_date = new Date(arg.from);
    var to_date = new Date(arg.to);
    from_date = new Date(
      from_date.getFullYear(),
      from_date.getMonth(),
      from_date.getDate(),
      0,
      0,
      0,
      0
    );
    to_date = new Date(
      to_date.getFullYear(),
      to_date.getMonth(),
      to_date.getDate(),
      23,
      59,
      59,
      59
    );
    const customer = await db.customer.findByPk(arg.value);
    const invoice_list = await db.invoice.findAll({
      raw: true,
      nest: true,
      where: {
        customer_id: customer.label,
        invoice_date: {
          [Op.between]: [from_date, to_date],
        },
      },
    });
    const total = await db.invoice.findAll({
      raw: true,
      nest: true,
      where: {
        customer_id: customer.label,
        invoice_date: {
          [Op.between]: [from_date, to_date],
        },
      },
      attributes: [
        [db.sequelize.fn("sum", db.sequelize.col("total_items")), "total_item"],
        [db.sequelize.fn("sum", db.sequelize.col("total")), "total_amount"],
        [db.sequelize.fn("sum", db.sequelize.col("cgst")), "total_tax"],
        [db.sequelize.fn("sum", db.sequelize.col("balance")), "total_balance"],
      ],
    });

    Promise.all([invoice_list, total])
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-customer-history-date-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-customer-history-date-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-customer-history-date-reply", dataR);
  }
});
