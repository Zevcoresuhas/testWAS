const { ipcMain } = require("electron");
const db = require("../models");

ipcMain.on("asynchronous-group-get", async (event, arg) => {
  try {
    const get = await db.group
      .findAll({
        raw: true,
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-group-get-reply", dataR);
      })
      .catch((err) => {
        event.reply("asynchronous-group-get-reply", err);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-group-get-reply", dataR);
  }
});

ipcMain.on("asynchronous-group-add", async (event, arg) => {
  try {
    const detail = {
      label: arg.name,
      added_by: 1,
    };
    //create the group data
    const add = await db.group.create(detail);
    const get = await db.group.findAll({
      raw: true,
    });

    Promise.all(get)
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-group-add-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-group-add-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-group-add-reply", dataR);
  }
});

ipcMain.on("asynchronous-group-edit", async (event, arg) => {
  try {
    const detail = {
      label: arg.editName,
      updated_by: 1,
    };
    //create the group data
    const added = await db.group.update(detail, {
      where: { value: arg.value },
    });
    const get = await db.group
      .findAll({
        raw: true,
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-group-edit-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-group-edit-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-group-edit-reply", dataR);
  }
});

ipcMain.on("asynchronous-group-delete", async (event, arg) => {
  try {
    //create the group data
    const added = await db.group
      .destroy({
        where: { value: arg },
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-group-delete-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-group-delete-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-group-delete-reply", dataR);
  }
});

ipcMain.on("asynchronous-group-bulk", async (event, arg) => {
  try {
    const data = arg;
    //store each group with loops
    for (let i = 1; i < data.length; i++) {
      const add_field = {
        label: data[i][0],

        added_by: 1,
      };
      await db.group.create(add_field);
    }
    const get = await db.group.findAll({
      raw: true,
    });

    Promise.all(get)
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-group-bulk-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-group-bulk-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-group-bulk-reply", dataR);
  }
});
