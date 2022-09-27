const electron = window.require("electron");

const { ipcRenderer } = electron;

// For get all tax data
export const getTax = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-tax-get-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-tax-get", sql);
  });
};

// For add tax data
export const addTax = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-tax-add-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-tax-add", sql);
  });
};

// For edit tax data
export const editTax = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-tax-edit-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-tax-edit", sql);
  });
};

// For delete the tax data
export const deleteTax = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-tax-delete-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-tax-delete", sql);
  });
};

// For get all tax data
export const bulkTax = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-tax-bulk-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-tax-bulk", sql);
  });
};
