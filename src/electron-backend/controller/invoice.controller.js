const { ipcMain, Notification, BrowserWindow } = require("electron");
const db = require("../models");
const Op = db.Sequelize.Op;
ipcMain.on("asynchronous-invoice-get", async (event, arg) => {
  try {
    const get = await db.invoice
      .findAll({
        order: [["invoice_date", "DESC"]],
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
        event.reply("asynchronous-invoice-get-reply", dataR);
      })
      .catch((err) => {
        event.reply("asynchronous-invoice-get-reply", err);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-invoice-get-reply", dataR);
  }
});

ipcMain.on("asynchronous-invoice-one-get", async (event, arg) => {
  try {
    const get = await db.invoice
      .findOne({
        where: { invoice_number: arg.id },

        include: [
          {
            model: db.invoice_item,
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
        event.reply("asynchronous-invoice-one-get-reply", dataR);
      })
      .catch((err) => {
        event.reply("asynchronous-invoice-one-get-reply", err);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-invoice-one-get-reply", dataR);
  }
});

ipcMain.on("asynchronous-saves-get", async (event, arg) => {
  try {
    const get = await db.saveInvoice
      .findAll({
        raw: true,
        nested: true,
        order: [["invoice_date", "DESC"]],
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-saves-get-reply", dataR);
      })
      .catch((err) => {
        event.reply("asynchronous-saves-get-reply", err);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-saves-get-reply", dataR);
  }
});

ipcMain.on("asynchronous-saves-one-get", async (event, arg) => {
  try {
    const get = await db.saveInvoice
      .findOne({
        where: { invoice_number: arg.id },
        include: [
          {
            model: db.saveInvoice_item,
            required: false,
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
          },
        ],
      })
      .then((activities) => {
        const data = activities.toJSON();
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-saves-one-get-reply", dataR);
      })
      .catch((err) => {
        event.reply("asynchronous-saves-one-get-reply", err);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-saves-one-get-reply", dataR);
  }
});

ipcMain.on("asynchronous-invoice-add", async (event, arg) => {
  try {
    const stock_list = await db.stock.findAll();
    const data_list = arg.list;
    var check = 0; //for check varaible set 0
    //on loop check for each item stock limits
    for (let i = 0; i < stock_list.length; i++) {
      for (let j = 0; j < data_list.length; j++) {
        if (data_list[j].barcode == stock_list[i].barcode) {
          if (typeof data_list[j].product.type == "undefined") {
            if (
              Number(stock_list[i].reaming_item) < Number(data_list[j].count)
            ) {
              check = 1; //if any item get out of stock check will change 1
            }
          } else {
            if (Number(stock_list[i].net_weight) < Number(data_list[j].count)) {
              check = 1; //if any item get out of stock check will change 1
            }
          }
        }
      }
    }
    const account = await db.account.findOne({
      where: { value: 1 },
    });
    var prefix = "ZEVC";
    if (
      account.stock_prefix != "" &&
      account.stock_prefix != null &&
      typeof account.stock_prefix != "undefined"
    ) {
      prefix = account.stock_prefix;
    }
    //if check is 1 it gives the stock error other wise it save the invoice
    if (check == 0) {
      //get for last invoice id
      const last = await db.invoice.findAll({
        limit: 1,
        order: [["createdAt", "DESC"]],
      });
      var invoice = "";
      //check for last invoice null
      if (last.length > 0) {
        invoice = prefix + (Number(last[0].value) + 1); //add id with last invoice
      } else {
        invoice = prefix + 1; //or just add 1
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
        invoice_number: invoice,
        invoice_date: arg.date,
        customer_id: arg.customer,
        discount: Number(discount).toFixed(2),
        address: arg.address,
        sub_total: arg.subTotal,
        cgst: (Number(arg.totalTax) / 2).toFixed(2),
        sgst: (Number(arg.totalTax) / 2).toFixed(2),
        total: (
          Number(arg.totalTax) +
          Number(arg.subTotal) -
          Number(discount)
        ).toFixed(2),
        total_items: arg.list.length,
        paid: arg.paid,
        balance: Number(
          Number(arg.totalTax) +
            Number(arg.subTotal) -
            Number(discount) -
            Number(arg.paid)
        ).toFixed(2),
        bill_type: arg.sale_type,
        terms_of_delivery: arg.terms_of_delivery,
        remark: arg.remark,
        destination: arg.destination,
        despatched_through: arg.despatched_through,
        delivery_note_date: arg.delivery_note_date,
        despatch_doc_no: arg.despatch_doc_no,
        dated: arg.dated,
        buyer_order_no: arg.buyer_order_no,
        other_ref: arg.other_ref,
        suppliers_ref: arg.suppliers_ref,
        deliver_note: arg.deliver_note,
        bank_name: arg.bank_name,
      };
      //create invoice with varaibles
      const invoice_create = await db.invoice.create(detail); //get items list to varaibles
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

        //create new invoice item along with the invoice id

        //decrement stock value to invoice item count
        if (typeof list[i].product.type !== "") {
          const details2 = {
            invoice_id: invoice_create.value,
            invoice_date: arg.date,
            barcode: list[i].barcode,
            product_name: list[i].product.label,
            tax_rate: Number(
              (Number(list[i].product.tax) / 100) *
                (Number(list[i].product.price) * Number(list[i].count))
            ).toFixed(2),
            tax: list[i].product.tax,
            group_name: product_detail.group.label,
            subgroup_name: product_detail.subgroup.label,
            hsn: list[i].hsn,
            rate: list[i].product.price,
            count: list[i].count,
            amount: (Number(list[i].product.price) * list[i].count).toFixed(2),
          };
          await db.invoice_item.create(details2);
          await db.stock.decrement(
            { reaming_item: list[i].count },
            { where: { barcode: list[i].barcode } }
          );
        }
      }

      const stockCheck = await db.stock.findAll({
        raw: true,
        nest: true,
        group: ["product_id"],
        attributes: [
          [
            db.sequelize.fn("sum", db.sequelize.col("reaming_item")),
            "total_item",
          ],
        ],
        include: [
          {
            model: db.product,
            required: false,
          },
        ],
      });

      var depletion = 0;
      var product = "";
      for (let a = 0; a < stockCheck.length; a++) {
        if (stockCheck[a].total_item < stockCheck[a].product.stock_depletion) {
          depletion = 1;
          product = stockCheck[a].product;
        }
      }
      if (depletion == 1) {
        const notification = new Notification({
          title: "Product depletion",
          body:
            product.label +
            " has less than " +
            product.stock_depletion +
            " please add stock as soon",
        });
        notification.on("click", (event, arg) => {
          event.preventDefault();

          var win = BrowserWindow.getAllWindows()[0];

          win.loadURL("http://localhost:3000/#/home/1");
        });
        notification.show();
      }

      //get invoice create promisse
      Promise.all([invoice_create])
        .then((data) => {
          const dataR = {
            status: 200,
            data: { data },
          };
          event.reply("asynchronous-invoice-add-reply", dataR);
        })
        .catch((err) => {
          const dataR = {
            status: 500,
            data: { message: err },
          };
          event.reply("asynchronous-invoice-add-reply", dataR);
        });
    } else {
      const dataR = {
        status: 500,
        data: { message: "Check the stock" },
      };
      event.reply("asynchronous-invoice-add-reply", dataR);
    }
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-invoice-add-reply", dataR);
  }
});

ipcMain.on("asynchronous-invoice-save-add", async (event, arg) => {
  try {
    //get for last invoice id
    const last = await db.saveInvoice.findAll({
      limit: 1,
      order: [["invoice_date", "DESC"]],
    });
    var invoice = "";
    //check for last invoice null
    if (last.length > 0) {
      invoice = "SVIN" + (Number(last[0].value) + 1); //add id with last invoice
    } else {
      invoice = "SVIN" + 1; //or just add 1
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
      invoice_number: invoice,
      invoice_date: arg.date,
      customer_id: arg.customer,
      discount: Number(discount).toFixed(2),

      sub_total: arg.subTotal,
      cgst: (Number(arg.totalTax) / 2).toFixed(2),
      sgst: (Number(arg.totalTax) / 2).toFixed(2),
      total: (
        Number(arg.totalTax) +
        Number(arg.subTotal) -
        Number(discount)
      ).toFixed(2),
      total_items: arg.list.length,
      paid: arg.paid,
      balance: Number(
        Number(arg.totalTax) +
          Number(arg.subTotal) -
          Number(discount) -
          Number(arg.paid)
      ).toFixed(2),
      bill_type: arg.sale_type,
      customer_id: arg.customer,
    };
    //create invoice with varaibles
    const invoice_create = await db.saveInvoice.create(detail); //get items list to varaibles
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

      //create new invoice item along with the invoice id

      //decrement stock value to invoice item count
      if (typeof list[i].product.type !== "") {
        const details2 = {
          invoice_id: invoice_create.value,
          invoice_date: arg.date,
          barcode: list[i].barcode,
          product_name: list[i].product.label,
          tax_rate: Number(
            (Number(list[i].product.tax) / 100) *
              (Number(list[i].product.price) * Number(list[i].count))
          ).toFixed(2),
          tax: list[i].product.tax,
          group_name: product_detail.group.label,
          product_id: product_detail.value,
          subgroup_name: product_detail.subgroup.label,
          hsn: list[i].hsn,
          rate: list[i].product.price,
          count: list[i].count,
          amount: (Number(list[i].product.price) * list[i].count).toFixed(2),
        };
        await db.saveInvoice_item.create(details2);
      }
    }
    //get invoice create promisse
    Promise.all([invoice_create])
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-invoice-save-add-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err },
        };
        event.reply("asynchronous-invoice-save-add-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-invoice-save-add-reply", dataR);
  }
});

ipcMain.on("asynchronous-saves-delete", async (event, arg) => {
  try {
    //create the brand data
    const added = await db.saveInvoice
      .destroy({
        where: { value: arg },
      })
      .then((data) => {
        const dataR = {
          status: 200,
          data: { data },
        };
        event.reply("asynchronous-saves-delete-reply", dataR);
      })
      .catch((err) => {
        const dataR = {
          status: 500,
          data: { message: err.message },
        };
        event.reply("asynchronous-saves-delete-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-saves-delete-reply", dataR);
  }
});

ipcMain.on("asynchronous-invoice-add2", async (event, arg) => {
  try {
    const stock_list = await db.stock.findAll({
      raw: true,
    });
    const data_list = arg.list;
    var check = 0; //for check varaible set 0
    //on loop check for each item stock limits
    for (let i = 0; i < data_list.length; i++) {
      for (let j = 0; j < stock_list.length; j++) {
        var count = 0;
        if (data_list[i].product.value == stock_list[j].product_id) {
          count += stock_list[j].reaming_item;
        }
      }

      if (count < Number(data_list[i].count)) {
        check = 1; //if any item get out of stock check will change 1
      }
    }
    const account = await db.account.findOne({
      where: { value: 1 },
    });
    var prefix = "ZEVC";
    if (
      account.stock_prefix != "" &&
      account.stock_prefix != null &&
      typeof account.stock_prefix != "undefined"
    ) {
      prefix = account.stock_prefix;
    }
    //if check is 1 it gives the stock error other wise it save the invoice
    if (check == 0) {
      //get for last invoice id
      const last = await db.invoice.findAll({
        raw: true,
        limit: 1,
        order: [["createdAt", "DESC"]],
      });
      var invoice = "";
      //check for last invoice null
      if (last.length > 0) {
        invoice = prefix + (Number(last[0].value) + 1); //add id with last invoice
      } else {
        invoice = prefix + 1; //or just add 1
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
        invoice_number: invoice,
        invoice_date: arg.date,
        customer_id: arg.customer,
        discount: Number(arg.discountValue).toFixed(2),
        address: arg.address,
        sub_total: arg.subTotal,
        cgst: (Number(arg.totalTax) / 2).toFixed(2),
        sgst: (Number(arg.totalTax) / 2).toFixed(2),
        total: arg.grand_total,
        total_items: arg.list.length,
        paid: arg.paid,
        balance: arg.balance,
        bill_type: arg.sale_type,
        terms_of_delivery: arg.terms_of_delivery,
        remark: arg.remark,
        destination: arg.destination,
        despatched_through: arg.despatched_through,
        delivery_note_date: arg.delivery_note_date,
        despatch_doc_no: arg.despatch_doc_no,
        dated: arg.dated,
        buyer_order_no: arg.buyer_order_no,
        other_ref: arg.other_ref,
        suppliers_ref: arg.suppliers_ref,
        deliver_note: arg.deliver_note,
        bank_name: arg.bank_name,
      };
      //create invoice with varaibles
      const invoice_create = await db.invoice.create(detail); //get items list to varaibles
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

        //create new invoice item along with the invoice id

        //decrement stock value to invoice item count
        if (typeof list[i].product.type !== "") {
          const details2 = {
            invoice_id: invoice_create.value,
            invoice_date: arg.date,
            barcode: "",
            product_name: list[i].product.label,
            tax_rate: list[i].tax,
            tax: list[i].tax_per,
            group_name: product_detail.group.label,
            subgroup_name: product_detail.subgroup.label,
            hsn: product_detail.hsn,
            rate: list[i].product.price,
            count: list[i].qty,
            amount: list[i].total,
          };
          await db.invoice_item.create(details2);

          const stock_list2 = await db.stock.findAll({
            raw: true,
          });

          var qty = list[i].qty;
          console.log(qty, "qty");
          for (let j = 0; j < stock_list2.length; j++) {
            if (product_detail.value == stock_list2[j].product_id) {
              if (qty > 0) {
                var count = 0;
                count = stock_list2[j].reaming_item - qty;
                console.log(
                  count,
                  stock_list2[j].reaming_item,
                  qty,
                  "checking"
                );
                if (count <= 0) {
                  await db.stock.update(
                    { reaming_item: 0 },
                    { where: { value: stock_list2[j].value } }
                  );
                  qty = qty - stock_list2[j].reaming_item;
                } else {
                  await db.stock.update(
                    { reaming_item: stock_list2[j].reaming_item - qty },
                    { where: { value: stock_list2[j].value } }
                  );
                  qty = 0;
                }
              }
            }
          }
        }
      }

      if (arg.sale_type == "Cash") {
        const detail45 = {
          date: arg.date,
          transaction_type: "Income",
          label: invoice_create.invoice_number,
          amount: arg.paid,
        };
        //create the cash data
        const add = await db.cash_ledger.create(detail45);
      } else {
        const bank = await db.bank.findOne({
          raw: true,
          where: { label: arg.bank_name },
        });
        const detail45 = {
          date: arg.date,
          bank_id: bank.value,
          transaction_type: "Deposit",
          label: invoice_create.invoice_number,
          amount: arg.paid,
        };
        //create the cash data
        const add = await db.bank_ledger.create(detail45);
        var amm = Number(
          +Number(bank.amount) + +Number(arg.grand_total)
        ).toFixed(2);
        const bank2 = await db.bank.update(
          { amount: amm },
          {
            where: { label: arg.bank_name },
          }
        );
      }

      const stockCheck = await db.stock.findAll({
        raw: true,
        nest: true,
        group: ["product_id"],
        attributes: [
          [
            db.sequelize.fn("sum", db.sequelize.col("reaming_item")),
            "total_item",
          ],
        ],
        include: [
          {
            model: db.product,
            required: false,
          },
        ],
      });

      var depletion = 0;
      var product = "";
      for (let a = 0; a < stockCheck.length; a++) {
        if (stockCheck[a].total_item < stockCheck[a].product.stock_depletion) {
          depletion = 1;
          product = stockCheck[a].product;
        }
      }

      //get invoice create promisse
      Promise.all([invoice_create])
        .then((data) => {
          const dataR = {
            status: 200,
            data: { data },
          };
          event.reply("asynchronous-invoice-add2-reply", dataR);
        })
        .catch((err) => {
          const dataR = {
            status: 500,
            data: { message: err },
          };
          event.reply("asynchronous-invoice-add2-reply", dataR);
        });
    } else {
      const dataR = {
        status: 500,
        data: { message: "Check the stock" },
      };
      event.reply("asynchronous-invoice-add2-reply", dataR);
    }
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-invoice-add2-reply", dataR);
  }
});
