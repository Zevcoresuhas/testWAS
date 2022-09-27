const {
  ipcMain,
  app,
  desktopCapturer,
  Notification,
  BrowserWindow,
} = require("electron");

const fs = require("fs");
const { autoUpdater } = require("electron-updater");
const db = require("../models");
const Op = db.Sequelize.Op;
// For close the window
ipcMain.on("asynchronous-closeWindow", async (event, arg) => {
  try {
    event.preventDefault();
    app.quit();
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-closeWindow-reply", dataR);
  }
});

// For minimize window
ipcMain.on("asynchronous-minimize", async (event, arg) => {
  try {
    event.preventDefault();
    var win = BrowserWindow.getAllWindows()[0];

    win.minimize();
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-minimize-reply", dataR);
  }
});

ipcMain.on("asynchronous-hide", async (event, arg) => {
  try {
    event.preventDefault();
    var win = BrowserWindow.getAllWindows()[0];

    win.hide();
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-hide-reply", dataR);
  }
});

// For maximize window
ipcMain.on("asynchronous-maximize", async (event, arg) => {
  try {
    event.preventDefault();

    var win = BrowserWindow.getAllWindows()[0];
    win.maximize();
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-maximize-reply", dataR);
  }
});

// For unmaximize page
ipcMain.on("asynchronous-unmaximize", async (event, arg) => {
  try {
    var win = BrowserWindow.getAllWindows()[0];
    win.unmaximize();
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-unmaximize-reply", dataR);
  }
});

// For reload page
ipcMain.on("asynchronous-reload", async (event, arg) => {
  try {
    event.preventDefault();
    var win = BrowserWindow.getAllWindows()[0];
    win.reload();
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-reload-reply", dataR);
  }
});

// For reload page
ipcMain.on("asynchronous-update", async (event, arg) => {
  try {
    var win = BrowserWindow.getAllWindows()[0];
    win.once("ready-to-show", () => {
      const update = autoUpdater.checkForUpdates();
    });
    const dataR = {
      status: 200,
      data: { message: autoUpdater.checkForUpdates() },
    };
    event.reply("asynchronous-update-reply", dataR);
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-update-reply", dataR);
  }
});

// For reload page
ipcMain.on("asynchronous-mail-otp", async (event, arg) => {
  try {
    var nodemailer = require("nodemailer");
    var emails = arg.email;
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "zevcored@gmail.com",
        pass: "jzdntsvnkhzqchme",
      },
    });
    let mailOption = {
      from: "zevcored@gmail.com",
      to: arg.email,
      subject: "OTP",
      text: arg.otp,
    };
    transporter.sendMail(mailOption, function (err, data) {
      if (err) {
        console.log("Error Occurs");
      } else {
        console.log("Email sent successfully");
        const dataR = {
          status: 200,
          data: "Email sent successfully",
        };
        event.reply("asynchronous-mail-otp-reply", dataR);
      }
    });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-mail-otp-reply", dataR);
  }
});

ipcMain.on("asynchronous-backup", async (event, arg) => {
  try {
    //save image to database and file
    var JSZip = require("jszip");
    fs.readFile(arg.path, function (err, data) {
      var zip = new JSZip();
      zip.loadAsync(data).then(function (contents) {
        Object.keys(contents.files).forEach(function (filename) {
          zip
            .file(filename)
            .async("nodebuffer")
            .then(function (content) {
              fs.writeFileSync(
                "./src/assets/db/" + filename,
                content,
                function (err) {
                  const dataR = {
                    status: 500,
                    data: { message: "Database backup restored error" },
                  };
                  event.reply("asynchronous-backup-reply", dataR);
                }
              );
              const dataR = {
                status: 200,
                data: { message: "Database backup restored" },
              };
              event.reply("asynchronous-backup-reply", dataR);
            });
        });
      });
    });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-backup-reply", dataR);
  }
});

ipcMain.on("asynchronous-passbook", async (event, arg) => {
  try {
    //save image to database and file
    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const NOW = new Date();

    const total = await db.invoice.findAll({
      raw: true,
      where: {
        invoice_date: {
          [Op.gt]: TODAY_START,
          [Op.lt]: NOW,
        },
      },
      attributes: [
        [db.sequelize.fn("sum", db.sequelize.col("total")), "amount_total"],
      ],
    });
    const total_list = await db.invoice.findAll({
      raw: true,
      where: {
        invoice_date: {
          [Op.gt]: TODAY_START,
          [Op.lt]: NOW,
        },
      },
    });

    const Expense = await db.cash_ledger.findAll({
      raw: true,
      where: {
        date: {
          [Op.gt]: TODAY_START,
          [Op.lt]: NOW,
        },
        transaction_type: "Expense",
      },
      attributes: [
        [db.sequelize.fn("sum", db.sequelize.col("amount")), "amount_total"],
      ],
    });

    const Expense_list = await db.cash_ledger.findAll({
      raw: true,
      where: {
        date: {
          [Op.gt]: TODAY_START,
          [Op.lt]: NOW,
        },
        transaction_type: "Expense",
      },
    });
    const Income = await db.cash_ledger.findAll({
      raw: true,
      where: {
        date: {
          [Op.gt]: TODAY_START,
          [Op.lt]: NOW,
        },
        transaction_type: "Income",
      },
      attributes: [
        [db.sequelize.fn("sum", db.sequelize.col("amount")), "amount_total"],
      ],
    });
    console.log(TODAY_START, NOW);
    const Income_list = await db.cash_ledger.findAll({
      raw: true,
      where: {
        date: {
          [Op.gt]: TODAY_START,
          [Op.lt]: NOW,
        },
        transaction_type: "Income",
      },
    });
    console.log(Income_list, "income");
    const pass = await db.passbook.findAll({
      raw: true,
      order: [["createdAt", "DESC"]],
    });
    Promise.all([
      total,
      total_list,
      Expense,
      Expense_list,
      Income,
      Income_list,
      pass,
    ])
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-passbook-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-passbook-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-passbook-reply", dataR);
  }
});

ipcMain.on("asynchronous-passbook-generate", async (event, arg) => {
  try {
    var date = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
    var date2 = new Date(new Date().setHours(23, 59, 59, 999)).toISOString();
    if (arg.date != null) {
      date = new Date(arg.date);
    } else {
      //if date null get last created passbook date
      const old_date = await db.passbook.findAll({
        raw: true,
        limit: 1,
        order: [["createdAt", "DESC"]],
      });
      // get first invoice item date
      const user = await db.user.findOne({
        raw: true,
        where: { value: 1 },
      });
      // for set old date
      if (old_date.length == 0) {
        date = new Date(user.createdAt);
      } else {
        date = new Date(old_date[0].date);
      }
    }
    var actualDate = date;
    // Setting date ending time
    date2 = new Date(
      actualDate.getFullYear(),
      actualDate.getMonth(),
      actualDate.getDate(),
      23,
      59,
      59
    );
    // Setting date starting time
    date = new Date(
      actualDate.getFullYear(),
      actualDate.getMonth(),
      actualDate.getDate(),
      0,
      0,
      0
    );

    var today = new Date();
    today = new Date(today.setDate(today.getDate()));
    // check for the today date greater than date for adding
    while (today > date) {
      const total = await db.invoice.findAll({
        raw: true,
        where: {
          invoice_date: {
            [Op.gt]: date,
            [Op.lt]: date2,
          },
        },
        attributes: [
          [db.sequelize.fn("sum", db.sequelize.col("total")), "amount_total"],
        ],
      });
      const Expense = await db.cash_ledger.findAll({
        raw: true,
        where: {
          date: {
            [Op.gt]: date,
            [Op.lt]: date2,
          },
          transaction_type: "Expense",
        },
        attributes: [
          [db.sequelize.fn("sum", db.sequelize.col("amount")), "amount_total"],
        ],
      });
      const Income = await db.cash_ledger.findAll({
        raw: true,
        where: {
          date: {
            [Op.gt]: date,
            [Op.lt]: date2,
          },
          transaction_type: "Income",
        },
        attributes: [
          [db.sequelize.fn("sum", db.sequelize.col("amount")), "amount_total"],
        ],
      });
      var positive =
        +Number(Income[0].amount_total).toFixed(2) +
        +Number(total[0].amount_total).toFixed(2);

      var negative = +Number(Expense[0].amount_total).toFixed(2);

      const detail = {
        date: date,
        sale: Number(total[0].amount_total).toFixed(2),
        income: Number(Income[0].amount_total).toFixed(2),
        expense: Number(Expense[0].amount_total).toFixed(2),
        balance: Number(positive) - Number(negative),
      };
      var check = await db.passbook.findOne({
        where: { date: date },
      });
      if (check != null) {
        await db.passbook.update(detail, {
          where: { date: date },
        });
      } else {
        await db.passbook.create(detail);
      }
      //incremnt date selection to plus one
      const result = await resolveAfter1Seconds();
      date = new Date(date.setDate(date.getDate() + 1));
      date2 = new Date(date2.setDate(date2.getDate() + 1));
    }

    //save image to database and file
    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const NOW = new Date();

    const total = await db.invoice.findAll({
      raw: true,
      where: {
        invoice_date: {
          [Op.gt]: TODAY_START,
          [Op.lt]: NOW,
        },
      },
      attributes: [
        [db.sequelize.fn("sum", db.sequelize.col("total")), "amount_total"],
      ],
    });
    const total_list = await db.invoice.findAll({
      raw: true,
      where: {
        invoice_date: {
          [Op.gt]: TODAY_START,
          [Op.lt]: NOW,
        },
      },
    });

    const Expense = await db.cash_ledger.findAll({
      raw: true,
      where: {
        date: {
          [Op.gt]: TODAY_START,
          [Op.lt]: NOW,
        },
        transaction_type: "Expense",
      },
      attributes: [
        [db.sequelize.fn("sum", db.sequelize.col("amount")), "amount_total"],
      ],
    });

    const Expense_list = await db.cash_ledger.findAll({
      raw: true,
      where: {
        date: {
          [Op.gt]: TODAY_START,
          [Op.lt]: NOW,
        },
        transaction_type: "Expense",
      },
    });
    const Income = await db.cash_ledger.findAll({
      raw: true,
      where: {
        date: {
          [Op.gt]: TODAY_START,
          [Op.lt]: NOW,
        },
        transaction_type: "Income",
      },
      attributes: [
        [db.sequelize.fn("sum", db.sequelize.col("amount")), "amount_total"],
      ],
    });
    const Income_list = await db.cash_ledger.findAll({
      raw: true,
      where: {
        date: {
          [Op.gt]: TODAY_START,
          [Op.lt]: NOW,
        },
        transaction_type: "Income",
      },
    });
    const pass = await db.passbook.findAll({
      raw: true,
      order: [["createdAt", "DESC"]],
    });
    Promise.all([
      total,
      total_list,
      Expense,
      Expense_list,
      Income,
      Income_list,
      pass,
    ])
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-passbook-generate-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-passbook-generate-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-passbook-generate-reply", dataR);
  }
});

// time delay 1sec for saving data
function resolveAfter1Seconds() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 1000);
  });
}
