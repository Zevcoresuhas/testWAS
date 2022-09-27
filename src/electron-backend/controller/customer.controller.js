const { ipcMain } = require("electron");
const db = require("../models");

ipcMain.on("asynchronous-customer-get", async (event, arg) => {
  try {
    const get = await db.customer
      .findAll({
        raw: true,
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-customer-get-reply", dataR);
      })
      .catch((err) => {
        event.reply("asynchronous-customer-get-reply", err);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-customer-get-reply", dataR);
  }
});

ipcMain.on("asynchronous-customer-add", async (event, arg) => {
  try {
    const detail = {
      label: arg.name,
      phone_number: arg.phone_number,
      credit_limit: arg.credit_limit,
      gstin: arg.gstin,
      door_no: arg.door_no,
      street: arg.street,
      locality: arg.locality,
      pincode: arg.pincode,
      city: arg.city,
      state: arg.state,
      added_by: 1,
    };
    //create the customer data
    const add = await db.customer.create(detail);
    const get = await db.customer.findAll({
      raw: true,
    });

    Promise.all(get)
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-customer-add-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-customer-add-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-customer-add-reply", dataR);
  }
});

ipcMain.on("asynchronous-customer-edit", async (event, arg) => {
  try {
    const detail = {
      label: arg.name,
      phone_number: arg.phone_number,
      credit_limit: arg.credit_limit,
      gstin: arg.gstin,
      door_no: arg.door_no,
      street: arg.street,
      locality: arg.locality,
      pincode: arg.pincode,
      city: arg.city,
      state: arg.state,
      updated_by: 1,
    };
    //create the customer data
    const added = await db.customer.update(detail, {
      where: { value: arg.value },
    });
    const get = await db.customer
      .findAll({
        raw: true,
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-customer-edit-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-customer-edit-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-customer-edit-reply", dataR);
  }
});

ipcMain.on("asynchronous-customer-delete", async (event, arg) => {
  try {
    //create the customer data
    const added = await db.customer
      .destroy({
        where: { value: arg },
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-customer-delete-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-customer-delete-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-customer-delete-reply", dataR);
  }
});

ipcMain.on("asynchronous-customer-bulk", async (event, arg) => {
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
      await db.customer.create(add_field, { transaction: t });
    }
    await t.commit();
    const get = await db.customer.findAll({
      raw: true,
    });

    Promise.all(get)
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-customer-bulk-reply", dataR);
      })
      .catch(async (err) => {
        await t.rollback();
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-customer-bulk-reply", dataR);
      });
  } catch (error) {
    t.rollback();
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-customer-bulk-reply", dataR);
  }
});
