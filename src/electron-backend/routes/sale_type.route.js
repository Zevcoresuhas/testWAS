const electron = window.require("electron");

const { ipcRenderer } = electron;

// For get all sale_type data
export const getSaleType = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-sale_type-get-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-sale_type-get", sql);
  });
};

// For add sale_type data
export const addSaleType = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-sale_type-add-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-sale_type-add", sql);
  });
};

// For edit sale_type data
export const editSaleType = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-sale_type-edit-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-sale_type-edit", sql);
  });
};

// For delete the sale_type data
export const deleteSaleType = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-sale_type-delete-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-sale_type-delete", sql);
  });
};

// For get all sale_type data
export const bulkSaleType = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-sale_type-bulk-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-sale_type-bulk", sql);
  });
};
