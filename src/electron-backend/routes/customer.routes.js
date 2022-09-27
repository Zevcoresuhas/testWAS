const electron = window.require("electron");

const { ipcRenderer } = electron;

// For get all customer data
export const getCustomer = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-customer-get-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-customer-get", sql);
  });
};

// For add customer data
export const addCustomer = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-customer-add-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-customer-add", sql);
  });
};

// For edit customer data
export const editCustomer = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-customer-edit-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-customer-edit", sql);
  });
};

// For delete the customer data
export const deleteCustomer = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-customer-delete-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-customer-delete", sql);
  });
};

// For get all customer data
export const bulkCustomer = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-customer-bulk-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-customer-bulk", sql);
  });
};
