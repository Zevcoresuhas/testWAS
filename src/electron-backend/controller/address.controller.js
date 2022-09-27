const { ipcMain } = require("electron");

const db = require("../models");

ipcMain.on("asynchronous-address-get", async (event, arg) => {
  try {
    const get = await db.address
      .findAll({
        raw: true,
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-address-get-reply", dataR);
      })
      .catch((err) => {
        event.reply("asynchronous-address-get-reply", err);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-address-get-reply", dataR);
  }
});

ipcMain.on("asynchronous-address-add", async (event, arg) => {
  try {
    //create the address data
    const add = await db.address.create(arg);
    const get = await db.address.findAll({
      raw: true,
    });

    Promise.all(get)
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-address-add-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-address-add-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-address-add-reply", dataR);
  }
});

ipcMain.on("asynchronous-address-edit", async (event, arg) => {
  try {
    //create the address data
    const added = await db.address.update(arg, {
      where: { value: arg.value },
    });
    const get = await db.address
      .findAll({
        raw: true,
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-address-edit-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-address-edit-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-address-edit-reply", dataR);
  }
});

ipcMain.on("asynchronous-address-delete", async (event, arg) => {
  try {
    //create the address data
    const added = await db.address
      .destroy({
        where: { value: arg },
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-address-delete-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-address-delete-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-address-delete-reply", dataR);
  }
});

ipcMain.on("asynchronous-address-bulk", async (event, arg) => {
  try {
    const data = arg;
    //store each group with loops
    for (let i = 1; i < data.length; i++) {
      const add_field = {
        label: data[i][0],

        added_by: 1,
      };
      await db.address.create(add_field);
    }
    const get = await db.address.findAll({
      raw: true,
    });

    Promise.all(get)
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-address-bulk-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-address-bulk-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-address-bulk-reply", dataR);
  }
});
