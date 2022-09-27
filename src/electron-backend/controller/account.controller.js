const { ipcMain } = require("electron");
const fs = require("fs");
const db = require("../models");

ipcMain.on("asynchronous-account-get", async (event, arg) => {
  try {
    const get = await db.account
      .findOne({
        raw: true,
        where: { value: 1 },
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-account-get-reply", dataR);
      })
      .catch((err) => {
        event.reply("asynchronous-account-get-reply", err);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-account-get-reply", dataR);
  }
});

ipcMain.on("asynchronous-user-count-get", async (event, arg) => {
  try {
    const get = await db.user
      .count()
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-user-count-get-reply", dataR);
      })
      .catch((err) => {
        event.reply("asynchronous-user-count-get-reply", err);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-user-count-get-reply", dataR);
  }
});

ipcMain.on("asynchronous-account-add", async (event, arg) => {
  try {
    const check = await db.account.findOne({
      where: { value: 1 },
    });
    var filename = "logo.png";
    if (check != null) {
      filename = check.logo;
    }

    if (arg.image !== "") {
      filename = Date.now() + ".png";
      //save image to database and file
      var data2 = arg.image;
      var base64Image = data2.split(";base64,").pop();
      fs.writeFile(
        "./public/images/logo/" + filename,
        base64Image,
        {
          encoding: "base64",
        },
        function (err) {}
      );
    }
    const detail = {
      label: arg.company_name,
      phone_number: arg.phone_number,
      company_name: arg.company_name,
      gstin: arg.gstin,
      cin: arg.cin,
      door: arg.door,
      street: arg.street,
      stock_prefix: arg.stock_prefix,
      locality: arg.locality,
      locality: arg.locality,
      pincode: arg.pincode.toString(),
      city: arg.city,
      state: arg.state,
      logo: filename,
      added_by: arg.added_by,
    };
    if (check == null) {
      const add = await db.account.create(detail);
    } else {
      const add = await db.account.update(detail, {
        where: { value: 1 },
      });
    }

    //create the account data

    const get = await db.account
      .findOne({
        raw: true,
        where: { value: 1 },
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };

        event.reply("asynchronous-account-add-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-account-add-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-account-add-reply", dataR);
  }
});
