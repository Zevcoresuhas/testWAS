const { ipcMain } = require("electron");
const db = require("../models");

ipcMain.on("asynchronous-subgroup-get", async (event, arg) => {
  const get = await db.subgroup
    .findAll({
      raw: true,
      nest: true,
      include: [
        {
          model: db.group,
          required: false,
          attributes: ["value", "label"],
        },
      ],
    })
    .then((data) => {
      const dataR = {
        status: 200,
        data: { data },
      };
      event.reply("asynchronous-subgroup-get-reply", dataR);
    })
    .catch((err) => {
      event.reply("asynchronous-subgroup-get-reply", err);
    });
});

ipcMain.on("asynchronous-subgroup-add", async (event, arg) => {
  try {
    const detail = {
      label: arg.name,
      group_id: arg.group_id,
      added_by: 1,
    };
    //create the subgroup data
    const add = await db.subgroup.create(detail);
    const get = await db.subgroup.findAll({
      raw: true,
      nest: true,
      include: [
        {
          model: db.group,
          required: false,
          attributes: ["value", "label"],
        },
      ],
    });

    Promise.all(get)
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-subgroup-add-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-subgroup-add-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-subgroup-add-reply", dataR);
  }
});

ipcMain.on("asynchronous-subgroup-edit", async (event, arg) => {
  try {
    const detail = {
      label: arg.editName,
      group_id: arg.group_id,
      updated_by: 1,
    };
    //create the subgroup data
    const added = await db.subgroup.update(detail, {
      where: { value: arg.value },
    });
    const get = await db.subgroup
      .findAll({
        raw: true,
        nest: true,
        include: [
          {
            model: db.group,
            required: false,
            attributes: ["value", "label"],
          },
        ],
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-subgroup-edit-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-subgroup-add-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-subgroup-add-reply", dataR);
  }
});

ipcMain.on("asynchronous-subgroup-delete", async (event, arg) => {
  try {
    //create the subgroup data
    const added = await db.subgroup
      .destroy({
        where: { value: arg },
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-subgroup-delete-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-subgroup-delete-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-subgroup-add-reply", dataR);
  }
});

ipcMain.on("asynchronous-subgroup-bulk", async (event, arg) => {
  try {
    const data = arg;
    //store each group with loops
    for (let i = 1; i < data.length; i++) {
      const add_field = {
        label: data[i][0],
        group_id: data[i][1],
        added_by: 1,
      };
      await db.subgroup.create(add_field);
    }
    const get = await db.subgroup.findAll({
      raw: true,
      nest: true,
      include: [
        {
          model: db.group,
          required: false,
          attributes: ["value", "label"],
        },
      ],
    });

    Promise.all(get)
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-subgroup-bulk-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-subgroup-bulk-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-subgroup-bulk-reply", dataR);
  }
});
