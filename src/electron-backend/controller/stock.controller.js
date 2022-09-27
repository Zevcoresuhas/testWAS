const { ipcMain } = require("electron");

const db = require("../models");

ipcMain.on("asynchronous-stock-get", async (event, arg) => {
  try {
    const get = await db.stock
      .findAll({
        raw: true,
        nest: true,
        include: [
          {
            model: db.product,
            required: false,
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
          },
        ],
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-stock-get-reply", dataR);
      })
      .catch((err) => {
        event.reply("asynchronous-stock-get-reply", err);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-stock-get-reply", dataR);
  }
});

ipcMain.on("asynchronous-stock-add", async (event, arg) => {
  try {
    // Remove all the empty to null
    Object.keys(arg).forEach(
      (k) => (arg[k] = arg[k] !== "" && arg[k] !== "undefined" ? arg[k] : null)
    );

    // Get last created id and added to invoice id
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
    const list = arg.editDetails;
    var venLabel = null;
    const vendor = await db.vendor.findByPk(arg.editVendor);
    if (vendor !== null) {
      venLabel = vendor.label;
    }
    for (i = 0; i < list.length; i++) {
      const product = await db.product.findByPk(list[i].product_id);

      const details2 = {
        invoice_id: invoice,
        vendor: venLabel,
        product_id: list[i].product_id,
        hsn: product.hsn,
        sku: product.sku,
        barcode: list[i].barcode,
        total_item: list[i].total_item,
        reaming_item: list[i].total_item,
        cost_per_item: list[i].cost_per_item,
        total: (
          Number(list[i].total_item) * Number(list[i].cost_per_item)
        ).toFixed(3),
        invoice_no: list[i].invoice_no,
        date: new Date(list[i].date),
      };
      const list_data = await db.stock.create(details2);

      //   For update the po, list status to 1 for added to stock status change
      if (list[i].value != "" && typeof list[i].value != "undefined") {
        const po_list5 = await db.po_list.update(
          {
            status: 1,
          },
          {
            where: { value: list[i].value },
          }
        );
      }
    }
    if (list[0].value != "" && typeof list[0].value != "undefined") {
      const po = await db.po.findOne({
        where: { value: arg.po_id },
        include: [
          {
            model: db.po_list,
            where: { status: 0 },
            required: false,
          },
        ],
      });

      //   For update the purchase order to status 1
      if (typeof po.po_lists != "undefined" || po.po_lists.length == 0) {
        const update = await db.po.update(
          {
            status: 1,
          },
          {
            where: { value: arg.po_id },
          }
        );
      }
    }

    const activities = await db.po.findAll({
      include: [
        {
          model: db.vendor,
          required: false,
          attributes: ["value", "label"],
        },
        {
          model: db.po_list,
          required: false,
          include: [
            {
              model: db.product,
              required: false,
              attributes: ["value", "label"],
            },
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
        },
      ],
    });
    const get = activities.map((activity) => {
      return activity.toJSON();
    });

    Promise.all(get)
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-stock-add-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-stock-add-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-stock-add-reply", dataR);
  }
});

ipcMain.on("asynchronous-stock-delete", async (event, arg) => {
  try {
    //create the stock data
    const added = await db.stock
      .destroy({
        where: { value: arg },
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-stock-delete-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-stock-delete-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-subgroup-add-reply", dataR);
  }
});

ipcMain.on("asynchronous-product-stock", async (event, arg) => {
  try {
    //create the stock data
    const added = await db.product
      .findAll({
        group: ["stocks.product_id"],
        raw: true,
        nest: true,
        attributes: [
          "value",
          "label",
          "image",
          [
            db.sequelize.fn("sum", db.sequelize.col("stocks.total_item")),
            "max_total",
          ],
          [
            db.sequelize.fn("sum", db.sequelize.col("stocks.reaming_item")),
            "max_reaming",
          ],
        ],
        include: [
          {
            model: db.stock,
            required: false,
          },
        ],
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-product-stock-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-product-stock-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-product-stock-reply", dataR);
  }
});
