const { ipcMain } = require("electron");
const db = require("../models");
const Op = db.Sequelize.Op;

ipcMain.on("asynchronous-reminder-get", async (event, arg) => {
  try {
    const get = await db.reminder
      .findAll({
        raw: true,
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-reminder-get-reply", dataR);
      })
      .catch((err) => {
        event.reply("asynchronous-reminder-get-reply", err);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-reminder-get-reply", dataR);
  }
});

ipcMain.on("asynchronous-reminder-today", async (event, arg) => {
  try {
    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const NOW = new Date();
    const get = await db.reminder
      .findAll({
        raw: true,
        where: {
          date: {
            [Op.gt]: TODAY_START,
            [Op.lt]: NOW,
          },
        },
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-reminder-today-reply", dataR);
      })
      .catch((err) => {
        event.reply("asynchronous-reminder-today-reply", err);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-reminder-today-reply", dataR);
  }
});

ipcMain.on("asynchronous-reminder-add", async (event, arg) => {
  try {
    const detail = {
      date: arg.date,
      time: arg.time,
      reminder: arg.reminder,
    };
    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const NOW = new Date();
    const add = await db.reminder.create(detail);
    const today = await db.reminder.findAll({
      raw: true,
      where: {
        date: {
          [Op.gt]: TODAY_START,
          [Op.lt]: NOW,
        },
      },
    });
    const get = await db.reminder.findAll({
      raw: true,
    });

    Promise.all([get, today])
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-reminder-add-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-reminder-add-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-reminder-add-reply", dataR);
  }
});

ipcMain.on("asynchronous-reminder-delete", async (event, arg) => {
  try {
    const added = await db.reminder
      .destroy({
        where: { value: arg },
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-reminder-delete-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-reminder-delete-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-reminder-delete-reply", dataR);
  }
});
