const { ipcMain } = require("electron");

const db = require("../models");

ipcMain.on("asynchronous-bank-get", async (event, arg) => {
  try {
    const get = await db.bank
      .findAll({
        raw: true,
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-bank-get-reply", dataR);
      })
      .catch((err) => {
        event.reply("asynchronous-bank-get-reply", err);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-bank-get-reply", dataR);
  }
});

ipcMain.on("asynchronous-bank-add", async (event, arg) => {
  try {
    //create the bank data
    const add = await db.bank.create(arg);
    const get = await db.bank.findAll({
      raw: true,
    });

    Promise.all(get)
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-bank-add-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-bank-add-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-bank-add-reply", dataR);
  }
});

ipcMain.on("asynchronous-bank-edit", async (event, arg) => {
  try {
    //create the bank data
    const added = await db.bank.update(arg, {
      where: { value: arg.value },
    });
    const get = await db.bank
      .findAll({
        raw: true,
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-bank-edit-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-bank-edit-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-bank-edit-reply", dataR);
  }
});

ipcMain.on("asynchronous-bank-delete", async (event, arg) => {
  try {
    //create the bank data
    const added = await db.bank
      .destroy({
        where: { value: arg },
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-bank-delete-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-bank-delete-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-bank-delete-reply", dataR);
  }
});

ipcMain.on("asynchronous-bank-bulk", async (event, arg) => {
  try {
    const data = arg;
    //store each group with loops
    for (let i = 1; i < data.length; i++) {
      const add_field = {
        label: data[i][0],

        added_by: 1,
      };
      await db.bank.create(add_field);
    }
    const get = await db.bank.findAll({
      raw: true,
    });

    Promise.all(get)
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-bank-bulk-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-bank-bulk-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-bank-bulk-reply", dataR);
  }
});
