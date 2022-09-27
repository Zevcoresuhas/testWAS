const { ipcMain, Notification, BrowserWindow } = require("electron");
const db = require("../models");
const Op = db.Sequelize.Op;

ipcMain.on("asynchronous-payment-add", async (event, arg) => {
  try {
    const payment = await db.payments.create(arg);
    const invoice = await db.invoice.findByPk(arg.invoice_id);
    const detail = {
      balance: Number(arg.balance - arg.amount_paid).toFixed(2),
      paid: Number(+Number(invoice.paid) + +Number(arg.amount_paid)).toFixed(2),
    };
    const data = await db.invoice
      .update(detail, {
        where: { value: arg.invoice_id },
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-payment-add-reply", dataR);
      })
      .catch((err) => {
        event.reply("asynchronous-payment-add-reply", err);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-payment-add-reply", dataR);
  }
});

ipcMain.on("asynchronous-journal-add", async (event, arg) => {
  try {
    const payment2 = await db.payments.create(arg);
    const detail2 = {
      amount: Number(arg.balance - arg.amount_paid).toFixed(2),
      date: arg.date,
      customer_id: arg.customer_id,
      invoice_id: arg.invoice_id,
    };
    const payment = await db.journal.create(detail2);
    const invoice = await db.invoice.findByPk(arg.invoice_id);
    const detail = {
      balance: 0,
      paid: invoice.total,
    };
    const data = await db.invoice
      .update(detail, {
        where: { value: arg.invoice_id },
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-journal-add-reply", dataR);
      })
      .catch((err) => {
        event.reply("asynchronous-journal-add-reply", err);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-journal-add-reply", dataR);
  }
});

ipcMain.on("asynchronous-payment-get", async (event, arg) => {
  try {
    const payment = await db.payments.findAll({
      raw: true,
      where: { invoice_id: arg },
    });
    const journal = await db.journal.findAll({
      raw: true,
      where: { invoice_id: arg },
    });
    Promise.all([payment, journal])
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-payment-get-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err },
        };
        event.reply("asynchronous-payment-get-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-payment-get-reply", dataR);
  }
});
