const { ipcMain } = require("electron");

const db = require("../models");

ipcMain.on("asynchronous-sale_type-get", async (event, arg) => {
  try {
    const get = await db.sale_type
      .findAll({
        raw: true,
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-sale_type-get-reply", dataR);
      })
      .catch((err) => {
        event.reply("asynchronous-sale_type-get-reply", err);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-sale_type-get-reply", dataR);
  }
});

ipcMain.on("asynchronous-sale_type-add", async (event, arg) => {
  try {
    const detail = {
      label: arg.name,
      added_by: 1,
    };
    //create the sale_type data
    const add = await db.sale_type.create(detail);
    const get = await db.sale_type.findAll({
      raw: true,
    });

    Promise.all(get)
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-sale_type-add-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-sale_type-add-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-sale_type-add-reply", dataR);
  }
});

ipcMain.on("asynchronous-sale_type-edit", async (event, arg) => {
  try {
    const detail = {
      label: arg.editName,
      updated_by: 1,
    };
    //create the sale_type data
    const added = await db.sale_type.update(detail, {
      where: { value: arg.value },
    });
    const get = await db.sale_type
      .findAll({
        raw: true,
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-sale_type-edit-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-sale_type-edit-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-sale_type-edit-reply", dataR);
  }
});

ipcMain.on("asynchronous-sale_type-delete", async (event, arg) => {
  try {
    //create the sale_type data
    const added = await db.sale_type
      .destroy({
        where: { value: arg },
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-sale_type-delete-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-sale_type-delete-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-sale_type-delete-reply", dataR);
  }
});

ipcMain.on("asynchronous-sale_type-bulk", async (event, arg) => {
  try {
    const data = arg;
    //store each group with loops
    for (let i = 1; i < data.length; i++) {
      const add_field = {
        label: data[i][0],

        added_by: 1,
      };
      await db.sale_type.create(add_field);
    }
    const get = await db.sale_type.findAll({
      raw: true,
    });

    Promise.all(get)
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-sale_type-bulk-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-sale_type-bulk-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-sale_type-bulk-reply", dataR);
  }
});
