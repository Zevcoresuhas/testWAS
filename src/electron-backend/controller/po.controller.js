const { ipcMain } = require("electron");

const db = require("../models");

ipcMain.on("asynchronous-po-get", async (event, arg) => {
  try {
    const get = await db.po
      .findAll({
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
      })
      .then((activities) => {
        const data = activities.map((activity) => {
          return activity.toJSON();
        });

        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-po-get-reply", dataR);
      })
      .catch((err) => {
        event.reply("asynchronous-po-get-reply", err);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-po-get-reply", dataR);
  }
});

ipcMain.on("asynchronous-po-add", async (event, arg) => {
  try {
    // Remove all the empty to null
    Object.keys(arg).forEach(
      (k) => (arg[k] = arg[k] !== "" && arg[k] !== "undefined" ? arg[k] : null)
    );

    // Get last created id and added to invoice id
    const last = await db.po.findAll({
      limit: 1,
      order: [["createdAt", "DESC"]],
    });
    var invoice = "";
    if (last.length > 0) {
      invoice = "ZCPO" + last[0].value;
    } else {
      invoice = "ZCPO" + 1;
    }

    const details = {
      vendor_id: arg.vendor,
      po_number: invoice,
      added_by: 1,
    };

    //create the po data
    const add = await db.po.create(details);
    var list = arg.details;
    for (i = 0; i < list.length; i++) {
      const details2 = {
        po_id: add.value,
        product_id: list[i].product_id,
        brand_id: list[i].brand_id,
        group_id: list[i].group_id,
        subgroup_id: list[i].subgroup_id,
        total_item: list[i].total_item,
        date: list[i].date,
      };
      const list_data = await db.po_list.create(details2);
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
        event.reply("asynchronous-po-add-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-po-add-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-po-add-reply", dataR);
  }
});

ipcMain.on("asynchronous-po-edit", async (event, arg) => {
  try {
    var list = arg.editDetails;
    for (i = 0; i < list.length; i++) {
      const details2 = {
        po_id: arg.po_id,
        product_id: list[i].product_id,
        brand_id: list[i].brand_id,
        group_id: list[i].group_id,
        subgroup_id: list[i].subgroup_id,
        total_item: list[i].total_item,
        date: list[i].date,
      };
      if (list[i].value != "" && typeof list[i].value != "undefined") {
        const list_data = await db.po_list.update(details2, {
          where: { value: list[i].value },
        });
      } else {
        const list_data = await db.po_list.create(details2);
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
        event.reply("asynchronous-po-edit-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-po-edit-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-po-edit-reply", dataR);
  }
});

ipcMain.on("asynchronous-po-delete", async (event, arg) => {
  try {
    //create the po data
    const added = await db.po
      .destroy({
        where: { value: arg },
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-po-delete-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-po-delete-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-po-delete-reply", dataR);
  }
});

ipcMain.on("asynchronous-po-list-delete", async (event, arg) => {
  try {
    //create the po-list data
    const added = await db.po_list.destroy({
      where: { value: arg },
    });
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
        event.reply("asynchronous-po-list-delete-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-po-list-delete-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-po-list-delete-reply", dataR);
  }
});
