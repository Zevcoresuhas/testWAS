const bcrypt = require("bcryptjs");
const { ipcMain } = require("electron");
const db = require("../models");

let nodeExec = require("child_process").exec; // For get child process run

// Get the current pc device id
function getDeviceId() {
  return new Promise((resolve, reject) => {
    nodeExec(
      "reg query HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\SQMClient",
      (error, stdout, stderr) => {
        if (error) {
          reject(error.message);
        }
        if (stderr) {
          reject(stderr);
        }
        resolve(stdout);
      }
    );
  });
}

// Register user if no
ipcMain.on("asynchronous-register-get", async (event, arg) => {
  try {
    var datas = await getDeviceId();
    var str = JSON.stringify(datas).split("\\r\\n")[3];
    str = str.substring(str.indexOf("{") + 1, str.lastIndexOf("}"));

    const detail = {
      label: "Admin",
      phone_number: arg.phone_number,
      image: "images.png",
      email: arg.email,
      userKey: bcrypt.hashSync(arg.key, 8),
      password: bcrypt.hashSync(arg.password, 8),
      deviceId: str,
      role: "Admin",
      brand: arg.brand,
      group: arg.group,
      subgroup: arg.subgroup,
      brands: arg.brands,
      groups: arg.groups,
      subgroups: arg.subgroups,
      brandCheck: arg.brandCheck,
      groupCheck: arg.groupCheck,
      subgroupCheck: arg.subgroupCheck,
      product: arg.product,
      products: arg.products,
    };
    const data = await db.user.findOne({
      raw: true,
      where: { email: arg.email },
    });
    const detailCH = {
      date: new Date(),
      transaction_type: "Income",
      label: "Starting balance",
      amount: arg.amount,
    };
    //create the cash data
    const addch = await db.cash_ledger.create(detailCH);

    if (
      arg.banklabel != "" &&
      arg.banklabel != null &&
      arg.account_no != "" &&
      arg.account_no != null &&
      arg.ifsc != "" &&
      arg.ifsc != null &&
      arg.name != "" &&
      arg.name != null &&
      arg.branch != "" &&
      arg.branch != null &&
      arg.bankamount != "" &&
      arg.bankamount != null
    ) {
      const detailCH = {
        label: arg.banklabel,
        account_no: arg.account_no,
        ifsc: arg.ifsc,
        name: arg.name,
        branch: arg.branch,
        amount: arg.bankamount,
      };
      //create the cash data
      const addch = await db.bank.create(detailCH);
    }
    if (data == null) {
      const added = await db.user
        .create(detail)
        .then((data) => {
          const dataR = {
            status: 200,
            data: { data },
          };
          event.reply("asynchronous-register-get-reply", dataR);
        })
        .catch((err) => {
          const dataR = {
            status: 500,
            data: { message: err.message },
          };
          event.reply("asynchronous-register-get-reply", dataR);
        });
    } else {
      const dataR = {
        status: 500,
        data: data,
      };
      event.reply("asynchronous-register-get-reply", dataR);
    }
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-register-get-reply", dataR);
  }
});

// For login user with email or phone no and password
ipcMain.on("asynchronous-login-get", async (event, arg) => {
  try {
    // Get the current pc Device id (Machine Id)
    var datas = await getDeviceId();
    var str = JSON.stringify(datas).split("\\r\\n")[3];
    str = str.substring(str.indexOf("{") + 1, str.lastIndexOf("}"));

    db.user
      .findOne({
        raw: true,
        where: {
          email: arg.email,
        },
      })
      .then((user) => {
        //if user not found with the email check with phone number
        if (!user) {
          db.user
            .findOne({
              raw: true,
              where: {
                phone_number: arg.email,
              },
            })
            .then((user) => {
              //both email and phone number not found send user not found
              if (!user) {
                const dataR = {
                  status: 404,
                  data: { message: "User Not found." },
                };
                event.reply("asynchronous-login-reply", dataR);
              } else {
                //if user get by phone number check password
                var passwordIsValid = bcrypt.compareSync(
                  arg.password,
                  user.password
                );
                //if password not valid send invalid password
                if (!passwordIsValid) {
                  const dataR = {
                    status: 401,
                    data: { message: "Invalid Password!" },
                  };
                  event.reply("asynchronous-login-reply", dataR);
                }
                // Check for same device id
                if (str == user.deviceId) {
                  const dataR = {
                    status: 200,
                    data: { user },
                  };
                  event.reply("asynchronous-login-reply", dataR);
                } else {
                  const dataR = {
                    status: 500,
                    data: {
                      message: "Your license key not activate for this device",
                    },
                  };
                  event.reply("asynchronous-login-reply", dataR);
                }
              }
            });
        } else {
          //if user get by phone number check password
          var passwordIsValid = bcrypt.compareSync(arg.password, user.password);
          //if password not valid send invalid password
          if (!passwordIsValid) {
            const dataR = {
              status: 401,
              data: { message: "Invalid Password!" },
            };
            event.reply("asynchronous-login-reply", dataR);
          }

          // Check for same device id
          if (str == user.deviceId) {
            const dataR = {
              status: 200,
              data: { user },
            };
            event.reply("asynchronous-login-reply", dataR);
          } else {
            const dataR = {
              status: 500,
              data: {
                message: "Your license key not activate for this device",
              },
            };
            event.reply("asynchronous-login-reply", dataR);
          }
        }
      })
      .catch((err) => {
        const dataR = {
          status: 404,
          data: { message: "User Not found." },
        };
        event.reply("asynchronous-login-reply", dataR);
      });
  } catch (error) {
    const dataR = {
      status: 500,
      data: { message: error.message },
    };
    event.reply("asynchronous-login-reply", dataR);
  }
});
