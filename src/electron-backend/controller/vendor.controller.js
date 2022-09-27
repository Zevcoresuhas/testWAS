const { ipcMain } = require("electron");
const db = require("../models");

ipcMain.on("asynchronous-vendor-get", async (event, arg) => {
  try {
    const get = await db.vendor
      .findAll({
        raw: true,
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-vendor-get-reply", dataR);
      })
      .catch((err) => {
        event.reply("asynchronous-vendor-get-reply", err);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-vendor-get-reply", dataR);
  }
});

ipcMain.on("asynchronous-vendor-add", async (event, arg) => {
  try {
    const detail = {
      label: arg.name,
      phone_number: arg.phone_number,
      phone_number2: arg.phone_number2,
      gstin: arg.gstin,
      door_no: arg.door_no,
      street: arg.street,
      locality: arg.locality,
      pincode: arg.pincode,
      city: arg.city,
      state: arg.state,
      added_by: 1,
    };
    //create the vendor data
    const add = await db.vendor.create(detail);
    const get = await db.vendor.findAll({
      raw: true,
    });

    Promise.all(get)
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-vendor-add-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-vendor-add-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-vendor-add-reply", dataR);
  }
});

ipcMain.on("asynchronous-vendor-edit", async (event, arg) => {
  try {
    const detail = {
      label: arg.name,
      phone_number: arg.phone_number,
      phone_number2: arg.phone_number2,
      gstin: arg.gstin,
      door_no: arg.door_no,
      street: arg.street,
      locality: arg.locality,
      pincode: arg.pincode,
      city: arg.city,
      state: arg.state,
      updated_by: 1,
    };
    //create the vendor data
    const added = await db.vendor.update(detail, {
      where: { value: arg.value },
    });
    const get = await db.vendor
      .findAll({
        raw: true,
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-vendor-edit-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-vendor-edit-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-vendor-edit-reply", dataR);
  }
});

ipcMain.on("asynchronous-vendor-delete", async (event, arg) => {
  try {
    //create the vendor data
    const added = await db.vendor
      .destroy({
        where: { value: arg },
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-vendor-delete-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-vendor-delete-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-vendor-delete-reply", dataR);
  }
});

ipcMain.on("asynchronous-vendor-bulk", async (event, arg) => {
  const t = await db.sequelize.transaction();
  try {
    const data = arg;
    //store each group with loops
    for (let i = 1; i < data.length; i++) {
      const add_field = {
        label: data[i][0],
        phone_number: data[i][1],
        phone_number2: data[i][2],
        gstin: data[i][3],
        door_no: data[i][4],
        street: data[i][5],
        locality: data[i][6],
        pincode: data[i][7],
        city: data[i][8],
        state: data[i][9],
        added_by: 1,
      };
      await db.vendor.create(add_field, { transaction: t });
    }
    await t.commit();
    const get = await db.vendor.findAll({
      raw: true,
    });

    Promise.all(get)
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-vendor-bulk-reply", dataR);
      })
      .catch(async (err) => {
        await t.rollback();
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-vendor-bulk-reply", dataR);
      });
  } catch (error) {
    t.rollback();
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-vendor-bulk-reply", dataR);
  }
});
