const electron = window.require("electron");
const { ipcRenderer } = electron;

// For get all product data
export const getProduct = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-product-get-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-product-get", sql);
  });
};

// For add product data
export const addProduct = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-product-add-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-product-add", sql);
  });
};

// For edit product data
export const editProduct = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-product-edit-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-product-edit", sql);
  });
};

// For delete the product data
export const deleteProduct = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-product-delete-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-product-delete", sql);
  });
};

// For bulk add the product data
export const bulkProduct = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-product-bulk-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-product-bulk", sql);
  });
};
