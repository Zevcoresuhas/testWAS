const { ipcMain } = require("electron");
const db = require("../models");
const fs = require("fs");

ipcMain.on("asynchronous-product-get", async (event, arg) => {
  try {
    const get = await db.product
      .findAll({
        raw: true,
        nest: true,
        include: [
          {
            model: db.brand,
            required: false,
            attributes: ["value", "label"],
          },
          {
            model: db.group,
            required: false,
            attributes: ["value", "label"],
          },
          {
            model: db.subgroup,
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
        event.reply("asynchronous-product-get-reply", dataR);
      })
      .catch((err) => {
        event.reply("asynchronous-product-get-reply", err);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-product-add-reply", dataR);
  }
});

ipcMain.on("asynchronous-product-add", async (event, arg) => {
  try {
    var filename = "product.png";

    if (arg.image !== "") {
      filename = Date.now() + ".png";
      //save image to database and file
      var data2 = arg.image;
      var base64Image = data2.split(";base64,").pop();
      fs.writeFile(
        "./public/images/product/" + filename,
        base64Image,
        {
          encoding: "base64",
        },
        function (err) {}
      );
    }

    const detail = {
      label: arg.name,
      image: filename,
      group_id: arg.group_id,
      subgroup_id: arg.subgroup_id,
      stock_depletion: arg.stock_depletion,
      brand_id: arg.brand_id,
      sku: arg.sku,
      hsn: arg.hsn,
      type: arg.type,
      price: arg.price,
      tax: arg.tax,
      added_by: 1,
    };
    //create the product data
    const add = await db.product.create(detail);
    if (arg.stock != 0 && arg.stock != "") {
      const last = await db.stock.findAll({
        limit: 1,
        order: [["createdAt", "DESC"]],
      });
      var invoice = "";
      if (last.length > 0) {
        invoice = "ZCST" + last[0].value;
      } else {
        invoice = "ZCST" + 1;
      }
      const details2 = {
        invoice_id: invoice,
        vendor: null,
        product_id: add.value,
        hsn: add.hsn,
        sku: add.sku,
        barcode: arg.barcode,
        total_item: arg.stock,
        reaming_item: arg.stock,
        cost_per_item: add.price,
        total: (Number(arg.stock) * Number(add.price)).toFixed(3),
        invoice_no: "-",
        date: new Date(),
      };
      const list_data = await db.stock.create(details2);
    }

    const get = await db.product.findAll({
      raw: true,
      nest: true,
      include: [
        {
          model: db.brand,
          required: false,
          attributes: ["value", "label"],
        },
        {
          model: db.group,
          required: false,
          attributes: ["value", "label"],
        },
        {
          model: db.subgroup,
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
        event.reply("asynchronous-product-add-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-product-add-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-product-add-reply", dataR);
  }
});

ipcMain.on("asynchronous-product-edit", async (event, arg) => {
  try {
    const one = await db.product.findByPk(arg.value);
    var filename = one.image;

    if (arg.image !== "") {
      if (filename != "product.png") {
        fs.unlinkSync("./public/images/product/" + filename);
      }

      filename = Date.now() + ".png";
      //save image to database and file
      var data2 = arg.image;
      var base64Image = data2.split(";base64,").pop();
      fs.writeFile(
        "./public/images/product/" + filename,
        base64Image,
        {
          encoding: "base64",
        },
        function (err) {}
      );
    }
    const detail = {
      label: arg.name,
      image: filename,
      group_id: arg.group_id,
      subgroup_id: arg.subgroup_id,
      stock_depletion: arg.stock_depletion,
      brand_id: arg.brand_id,
      sku: arg.sku,
      hsn: arg.hsn,
      type: arg.type,
      price: arg.price,
      tax: arg.tax,
      updated_by: 1,
    };
    //create the product data
    const added = await db.product.update(detail, {
      where: { value: arg.value },
    });
    const get = await db.product
      .findAll({
        raw: true,
        nest: true,
        include: [
          {
            model: db.brand,
            required: false,
            attributes: ["value", "label"],
          },
          {
            model: db.group,
            required: false,
            attributes: ["value", "label"],
          },
          {
            model: db.subgroup,
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
        event.reply("asynchronous-product-edit-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-product-add-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-product-add-reply", dataR);
  }
});

ipcMain.on("asynchronous-product-delete", async (event, arg) => {
  try {
    //create the product data
    const added = await db.product
      .destroy({
        where: { value: arg },
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-product-delete-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-product-delete-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-product-add-reply", dataR);
  }
});

// For adding product in bulk data
ipcMain.on("asynchronous-product-bulk", async (event, arg) => {
  const t = await db.sequelize.transaction();
  try {
    const data = arg;
    //store each group with loops
    for (let i = 1; i < data.length; i++) {
      const add_field = {
        label: data[i][0],
        label: data[i][0],
        image: "product.png",
        group_id: data[i][1],
        subgroup_id: data[i][2],
        brand_id: data[i][3],
        sku: data[i][4],
        hsn: data[i][5],
        price: data[i][6],
        tax: data[i][7],
        added_by: 1,
      };
      await db.product.create(add_field, { transaction: t });
    }
    await t.commit();
    const get = await db.product.findAll({
      raw: true,
      nest: true,
      include: [
        {
          model: db.brand,
          required: false,
          attributes: ["value", "label"],
        },
        {
          model: db.group,
          required: false,
          attributes: ["value", "label"],
        },
        {
          model: db.subgroup,
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
        event.reply("asynchronous-product-bulk-reply", dataR);
      })
      .catch(async (err) => {
        await t.rollback();
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-product-bulk-reply", dataR);
      });
  } catch (error) {
    t.rollback();
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-product-bulk-reply", dataR);
  }
});
