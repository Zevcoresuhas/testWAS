const { ipcMain } = require("electron");

const db = require("../models");
const Op = db.Sequelize.Op;

ipcMain.on("asynchronous-cash-get", async (event, arg) => {
  try {
    const get = await db.cash_ledger
      .findAll({
        raw: true,
        order: [["createdAt", "DESC"]],
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-cash-get-reply", dataR);
      })
      .catch((err) => {
        event.reply("asynchronous-cash-get-reply", err);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-cash-get-reply", dataR);
  }
});

ipcMain.on("asynchronous-cash-today-get", async (event, arg) => {
  try {
    const get = await db.cash_ledger
      .findAll({
        raw: true,
        order: [["createdAt", "DESC"]],
        date: {
          [Op.between]: [
            new Date().setHours(0, 0, 0, 0),
            new Date().setHours(23, 59, 59, 59), //for two date range bw get
          ],
        },
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-cash-today-get-reply", dataR);
      })
      .catch((err) => {
        event.reply("asynchronous-cash-today-get-reply", err);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-cash-today-get-reply", dataR);
  }
});

ipcMain.on("asynchronous-cash-search", async (event, arg) => {
  try {
    var type1 = "";
    var type2 = "";
    if (arg.transaction_type == "Both") {
      type1 = "Income";
      type2 = "Expense";
    } else if (arg.transaction_type == "Income") {
      type1 = "Income";
      type2 = "Income";
    } else if (arg.transaction_type == "Expense") {
      type1 = "Expense";
      type2 = "Expense";
    }
    //for find all cashledger with range of date using op of sequelize
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

    const get = await db.cash_ledger
      .findAll({
        raw: true,
        order: [["createdAt", "DESC"]],
        where: {
          date: {
            [Op.between]: [
              from_date,
              to_date, //for two date range bw get
            ],
          },
          transaction_type: {
            [Op.or]: [type1, type2],
          },
        },
        //include users
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-cash-search-reply", dataR);
      })
      .catch((err) => {
        event.reply("asynchronous-cash-search-reply", err);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-cash-search-reply", dataR);
  }
});

ipcMain.on("asynchronous-cash-add", async (event, arg) => {
  try {
    const detail = {
      date: arg.date,
      transaction_type: arg.transaction_type,
      label: arg.label,
      amount: arg.amount,
    };
    //create the cash data
    const add = await db.cash_ledger.create(detail);
    const get = await db.cash_ledger.findAll({
      raw: true,
      order: [["createdAt", "DESC"]],
    });

    Promise.all(get)
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-cash-add-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-cash-add-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-cash-add-reply", dataR);
  }
});

ipcMain.on("asynchronous-cash-edit", async (event, arg) => {
  try {
    const detail = {
      date: arg.date,
      transaction_type: arg.transaction_type,
      label: arg.label,
      amount: arg.amount,
    };
    //create the cash data
    const add = await db.cash_ledger.update(detail, {
      where: { value: arg.value },
    });
    const get = await db.cash_ledger.findAll({
      raw: true,
      order: [["createdAt", "DESC"]],
    });

    Promise.all(get)
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-cash-edit-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-cash-edit-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-cash-edit-reply", dataR);
  }
});

ipcMain.on("asynchronous-cash-delete", async (event, arg) => {
  try {
    const added = await db.cash_ledger
      .destroy({
        where: { value: arg },
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-cash-delete-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-cash-delete-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-cash-delete-reply", dataR);
  }
});
