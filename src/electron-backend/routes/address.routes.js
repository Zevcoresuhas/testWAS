const electron = window.require("electron");

const { ipcRenderer } = electron;

// For get all address data
export const getAddress = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-address-get-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-address-get", sql);
  });
};

// For add address data
export const addAddress = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-address-add-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-address-add", sql);
  });
};

// For edit address data
export const editAddress = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-address-edit-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-address-edit", sql);
  });
};

// For delete the address data
export const deleteAddress = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-address-delete-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-address-delete", sql);
  });
};

// For get all address data
export const bulkAddress = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-address-bulk-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-address-bulk", sql);
  });
};
