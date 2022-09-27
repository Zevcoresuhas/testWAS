const { ipcMain } = require("electron");

const db = require("../models");

ipcMain.on("asynchronous-brand-get", async (event, arg) => {
  try {
    const get = await db.brand
      .findAll({
        raw: true,
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-brand-get-reply", dataR);
      })
      .catch((err) => {
        event.reply("asynchronous-brand-get-reply", err);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-brand-get-reply", dataR);
  }
});

ipcMain.on("asynchronous-brand-add", async (event, arg) => {
  try {
    const detail = {
      label: arg.name,
      added_by: 1,
    };
    //create the brand data
    const add = await db.brand.create(detail);
    const get = await db.brand.findAll({
      raw: true,
    });

    Promise.all(get)
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-brand-add-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-brand-add-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-brand-add-reply", dataR);
  }
});

ipcMain.on("asynchronous-brand-edit", async (event, arg) => {
  try {
    const detail = {
      label: arg.editName,
      updated_by: 1,
    };
    //create the brand data
    const added = await db.brand.update(detail, {
      where: { value: arg.value },
    });
    const get = await db.brand
      .findAll({
        raw: true,
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-brand-edit-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-brand-edit-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-brand-edit-reply", dataR);
  }
});

ipcMain.on("asynchronous-brand-delete", async (event, arg) => {
  try {
    //create the brand data
    const added = await db.brand
      .destroy({
        where: { value: arg },
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-brand-delete-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-brand-delete-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-brand-delete-reply", dataR);
  }
});

ipcMain.on("asynchronous-brand-bulk", async (event, arg) => {
  try {
    const data = arg;
    //store each group with loops
    for (let i = 1; i < data.length; i++) {
      const add_field = {
        label: data[i][0],

        added_by: 1,
      };
      await db.brand.create(add_field);
    }
    const get = await db.brand.findAll({
      raw: true,
    });

    Promise.all(get)
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-brand-bulk-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-brand-bulk-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-brand-bulk-reply", dataR);
  }
});
