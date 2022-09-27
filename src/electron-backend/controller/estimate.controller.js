const { ipcMain } = require("electron");
const db = require("../models");
const Op = db.Sequelize.Op;
ipcMain.on("asynchronous-estimate-get", async (event, arg) => {
  try {
    const get = await db.estimate
      .findAll({
        order: [["createdAt", "DESC"]],
        raw: true,
        where: {
          delete: {
            [Op.not]: 1,
          },
        },
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-estimate-get-reply", dataR);
      })
      .catch((err) => {
        event.reply("asynchronous-estimate-get-reply", err);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-estimate-get-reply", dataR);
  }
});

ipcMain.on("asynchronous-estimate-one-get", async (event, arg) => {
  try {
    const get = await db.estimate
      .findOne({
        where: { estimate_number: arg.id },

        include: [
          {
            model: db.estimate_item,
            required: false,
          },
        ],
      })
      .then((activities) => {
        const data = activities.toJSON();

        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-estimate-one-get-reply", dataR);
      })
      .catch((err) => {
        event.reply("asynchronous-estimate-one-get-reply", err);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-estimate-one-get-reply", dataR);
  }
});

ipcMain.on("asynchronous-estimate-add", async (event, arg) => {
  try {
    //if check is 1 it gives the stock error other wise it save the estimate

    //get for last estimate id
    const last = await db.estimate.findAll({
      limit: 1,
      order: [["createdAt", "DESC"]],
    });
    var estimate = "";
    //check for last estimate null
    if (last.length > 0) {
      estimate = "ESTN" + (Number(last[0].value) + 1); //add id with last estimate
    } else {
      estimate = "ESTN" + 1; //or just add 1
    }
    var discount = 0;
    //check for discount type if percentage divide by 100 get original value
    if (arg.discount_type == "percentage") {
      discount =
        Number(arg.discountValue / 100) *
        (Number(arg.subTotal) + Number(arg.totalTax));
    } else {
      //discount by whole number
      discount = arg.discountValue;
    }
    //assign each data to variables
    const detail = {
      payment_type_id: arg.sale_type,
      estimate_number: estimate,
      estimate_date: arg.date,
      customer_id: arg.customer,
      discount: Number(discount).toFixed(2),

      sub_total: arg.subTotal,

      total: (Number(arg.subTotal) - Number(discount)).toFixed(2),
      total_items: arg.list.length,
      paid: arg.paid,
      balance: Number(
        Number(arg.subTotal) - Number(discount) - Number(arg.paid)
      ).toFixed(2),
      bill_type: arg.sale_type,
      customer_id: arg.customer,
    };
    //create estimate with varaibles
    const estimate_create = await db.estimate.create(detail); //get items list to varaibles
    var list = arg.list;
    for (i = 0; i < list.length; i++) {
      //get product details list for save group and subgroup
      const product_detail = await db.product.findOne({
        where: { label: list[i].product.label },
        include: [
          {
            model: db.group,
            required: false,
          },
          {
            model: db.subgroup,
            required: false,
          },
        ],
      });
      //asign each data to variables

      //create new estimate item along with the estimate id

      //decrement stock value to estimate item count
      if (typeof list[i].product.type !== "") {
        const details2 = {
          estimate_id: estimate_create.value,
          estimate_date: arg.date,
          barcode: list[i].barcode,
          product_name: list[i].product.label,
          group_name: product_detail.group.label,

          subgroup_name: product_detail.subgroup.label,
          hsn: list[i].hsn,
          rate: list[i].product.price,
          count: list[i].count,
          amount: (Number(list[i].product.price) * list[i].count).toFixed(2),
        };
        await db.estimate_item.create(details2);
      }
    }
    //get estimate create promisse
    Promise.all([estimate_create])
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-estimate-add-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err },
        };
        event.reply("asynchronous-estimate-add-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-estimate-add-reply", dataR);
  }
});
