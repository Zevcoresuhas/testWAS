const { ipcMain } = require("electron");

const db = require("../models");
const Op = db.Sequelize.Op;

ipcMain.on("asynchronous-bank-ledger-get", async (event, arg) => {
  try {
    const get = await db.bank_ledger
      .findAll({
        raw: true,
        nest: true,
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: db.bank,
            required: false,
          },
        ],
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-bank-ledger-get-reply", dataR);
      })
      .catch((err) => {
        event.reply("asynchronous-bank-ledger-get-reply", err);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-bank-ledger-get-reply", dataR);
  }
});

ipcMain.on("asynchronous-bank-ledger-today-get", async (event, arg) => {
  try {
    const get = await db.bank_ledger
      .findAll({
        raw: true,
        nest: true,
        order: [["createdAt", "DESC"]],
        date: {
          [Op.between]: [
            new Date().setHours(0, 0, 0, 0),
            new Date().setHours(23, 59, 59, 59), //for two date range bw get
          ],
        },
        include: [
          {
            model: db.bank,
            required: false,
          },
        ],
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-bank-ledger-today-get-reply", dataR);
      })
      .catch((err) => {
        event.reply("asynchronous-bank-ledger-today-get-reply", err);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-bank-ledger-today-get-reply", dataR);
  }
});

ipcMain.on("asynchronous-bank-ledger-search", async (event, arg) => {
  try {
    var type1 = "";
    var type2 = "";
    if (arg.transaction_type == "Both") {
      type1 = "Deposit";
      type2 = "Withdrawer";
    } else if (arg.transaction_type == "Deposit") {
      type1 = "Deposit";
      type2 = "Deposit";
    } else if (arg.transaction_type == "Withdrawer") {
      type1 = "Withdrawer";
      type2 = "Withdrawer";
    }
    //for find all bank-ledgerledger with range of date using op of sequelize
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

    const get = await db.bank_ledger
      .findAll({
        raw: true,
        nest: true,
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
        include: [
          {
            model: db.bank,
            required: false,
          },
        ],
        //include users
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-bank-ledger-search-reply", dataR);
      })
      .catch((err) => {
        event.reply("asynchronous-bank-ledger-search-reply", err);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-bank-ledger-search-reply", dataR);
  }
});

ipcMain.on("asynchronous-bank-ledger-add", async (event, arg) => {
  try {
    const detail = {
      date: arg.date,
      bank_id: arg.bank_id,
      transaction_type: arg.transaction_type,
      label: arg.label,
      amount: arg.amount,
    };
    const datas = await db.bank.findOne({
      raw: true,
      where: { value: arg.bank_id },
    });
    console.log(datas);
    if (datas != null) {
      if (arg.transaction_type == "Deposit") {
        const det = {
          amount: Number(+Number(datas.amount) + +Number(arg.amount)).toFixed(
            2
          ),
        };
        console.log(det);
        const update = await db.bank.update(det, {
          where: { value: arg.bank_id },
        });
      }

      if (arg.transaction_type == "Withdrawer") {
        const det = {
          amount: Number(
            parseFloat(datas.amount) - parseFloat(arg.amount)
          ).toFixed(2),
        };
        const update = await db.bank.update(det, {
          where: { value: arg.bank_id },
        });
      }
    }

    //create the bank-ledger data
    const add = await db.bank_ledger.create(detail);
    const get = await db.bank_ledger.findAll({
      raw: true,
      order: [["createdAt", "DESC"]],
    });
    const bank = await db.bank.findAll({
      raw: true,
    });

    Promise.all([get, bank])
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-bank-ledger-add-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-bank-ledger-add-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-bank-ledger-add-reply", dataR);
  }
});

ipcMain.on("asynchronous-bank-ledger-edit", async (event, arg) => {
  try {
    // remove old data
    const oldGet = await db.bank_ledger.findByPk(arg.value);
    const old = await db.bank.findByPk(oldGet.bank_id);
    if (oldGet.transaction_type == "Deposit") {
      const det = {
        amount: Number(
          parseFloat(old.amount) - parseFloat(oldGet.amount)
        ).toFixed(2),
      };

      await db.bank.update(det, {
        where: { value: oldGet.bank_id },
      });
    }
    if (oldGet.transaction_type == "Withdrawer") {
      const det = {
        amount: Number(+Number(old.amount) + +Number(oldGet.amount)).toFixed(2),
      };

      await db.bank.update(det, {
        where: { value: oldGet.bank_id },
      });
    }

    // Update new data
    const detail = {
      date: arg.date,
      bank_id: arg.bank_id,
      transaction_type: arg.transaction_type,
      label: arg.label,
      amount: arg.amount,
    };
    const datas = await db.bank.findOne({
      raw: true,
      where: { value: arg.bank_id },
    });
    console.log(datas);
    if (datas != null) {
      if (arg.transaction_type == "Deposit") {
        const det = {
          amount: Number(+Number(datas.amount) + +Number(arg.amount)).toFixed(
            2
          ),
        };
        console.log(det);
        const update = await db.bank.update(det, {
          where: { value: arg.bank_id },
        });
      }

      if (arg.transaction_type == "Withdrawer") {
        const det = {
          amount: Number(
            parseFloat(datas.amount) - parseFloat(arg.amount)
          ).toFixed(2),
        };
        const update = await db.bank.update(det, {
          where: { value: arg.bank_id },
        });
      }
    }

    //create the bank-ledger data
    const add = await db.bank_ledger.update(detail, {
      where: { value: arg.value },
    });
    const get = await db.bank_ledger.findAll({
      raw: true,
      order: [["createdAt", "DESC"]],
    });
    const bank = await db.bank.findAll({
      raw: true,
    });

    Promise.all([get, bank])
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-bank-ledger-edit-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-bank-ledger-edit-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-bank-ledger-edit-reply", dataR);
  }
});

ipcMain.on("asynchronous-bank-ledger-delete", async (event, arg) => {
  try {
    const get = await db.bank_ledger.findByPk(arg);
    const old = await db.bank.findByPk(get.bank_id);
    if (get.transaction_type == "Deposit") {
      const det = {
        amount: Number(parseFloat(old.amount) - parseFloat(get.amount)).toFixed(
          2
        ),
      };

      await db.bank.update(det, {
        where: { value: get.bank_id },
      });
    }
    if (get.transaction_type == "Withdrawer") {
      const det = {
        amount: Number(+Number(old.amount) + +Number(get.amount)).toFixed(2),
      };

      await db.bank.update(det, {
        where: { value: get.bank_id },
      });
    }

    const added = await db.bank_ledger
      .destroy({
        where: { value: arg },
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-bank-ledger-delete-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-bank-ledger-delete-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-bank-ledger-delete-reply", dataR);
  }
});
