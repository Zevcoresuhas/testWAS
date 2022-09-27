const { ipcMain } = require("electron");

const db = require("../models");
const bcrypt = require("bcryptjs");

ipcMain.on("asynchronous-user-get", async (event, arg) => {
  try {
    const get = await db.user
      .findAll({
        raw: true,
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-user-get-reply", dataR);
      })
      .catch((err) => {
        event.reply("asynchronous-user-get-reply", err);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-user-get-reply", dataR);
  }
});

ipcMain.on("asynchronous-user-one", async (event, arg) => {
  try {
    const get = await db.user
      .findOne({
        raw: true,
        where: { value: 1 },
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-user-one-reply", dataR);
      })
      .catch((err) => {
        event.reply("asynchronous-user-one-reply", err);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-user-one-reply", dataR);
  }
});

ipcMain.on("asynchronous-user-edit", async (event, arg) => {
  try {
    var detail = "";
    if (arg.password !== "") {
      detail = {
        label: arg.name,
        email: arg.email,
        password: bcrypt.hashSync(arg.password, 8),
        phone_number: arg.phone_number,
      };
    } else {
      detail = {
        label: arg.name,
        email: arg.email,
        phone_number: arg.phone_number,
      };
    }
    //create the user data
    const added = await db.user.update(detail, {
      where: { value: arg.value },
    });
    const get = await db.user
      .findAll({
        raw: true,
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-user-edit-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-user-edit-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-user-edit-reply", dataR);
  }
});
