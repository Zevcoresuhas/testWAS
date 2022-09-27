const { ipcMain } = require("electron");

const db = require("../models");

ipcMain.on("asynchronous-tax-get", async (event, arg) => {
  try {
    const get = await db.tax
      .findAll({
        raw: true,
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-tax-get-reply", dataR);
      })
      .catch((err) => {
        event.reply("asynchronous-tax-get-reply", err);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-tax-get-reply", dataR);
  }
});

ipcMain.on("asynchronous-tax-add", async (event, arg) => {
  try {
    const detail = {
      label: arg.name,
      added_by: 1,
    };
    //create the tax data
    const add = await db.tax.create(detail);
    const get = await db.tax.findAll({
      raw: true,
    });

    Promise.all(get)
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-tax-add-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-tax-add-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-tax-add-reply", dataR);
  }
});

ipcMain.on("asynchronous-tax-edit", async (event, arg) => {
  try {
    const detail = {
      label: arg.editName,
      updated_by: 1,
    };
    //create the tax data
    const added = await db.tax.update(detail, {
      where: { value: arg.value },
    });
    const get = await db.tax
      .findAll({
        raw: true,
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-tax-edit-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-tax-edit-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-tax-edit-reply", dataR);
  }
});

ipcMain.on("asynchronous-tax-delete", async (event, arg) => {
  try {
    //create the tax data
    const added = await db.tax
      .destroy({
        where: { value: arg },
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-tax-delete-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-tax-delete-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-tax-delete-reply", dataR);
  }
});

ipcMain.on("asynchronous-tax-bulk", async (event, arg) => {
  try {
    const data = arg;
    //store each group with loops
    for (let i = 1; i < data.length; i++) {
      const add_field = {
        label: data[i][0],

        added_by: 1,
      };
      await db.tax.create(add_field);
    }
    const get = await db.tax.findAll({
      raw: true,
    });

    Promise.all(get)
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-tax-bulk-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-tax-bulk-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-tax-bulk-reply", dataR);
  }
});
