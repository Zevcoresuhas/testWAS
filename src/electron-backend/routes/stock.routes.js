const electron = window.require("electron");

const { ipcRenderer } = electron;

// For get all stock data
export const getStock = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-stock-get-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-stock-get", sql);
  });
};

// For add stock data
export const addStock = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-stock-add-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-stock-add", sql);
  });
};

// For delete stock data
export const deleteStock = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-stock-delete-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-stock-delete", sql);
  });
};

// For delete stock data
export const productStock = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-product-stock-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-product-stock", sql);
  });
};
