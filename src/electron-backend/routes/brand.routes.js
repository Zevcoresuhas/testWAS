const electron = window.require("electron");

const { ipcRenderer } = electron;

// For get all brand data
export const getBrand = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-brand-get-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-brand-get", sql);
  });
};

// For add brand data
export const addBrand = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-brand-add-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-brand-add", sql);
  });
};

// For edit brand data
export const editBrand = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-brand-edit-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-brand-edit", sql);
  });
};

// For delete the brand data
export const deleteBrand = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-brand-delete-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-brand-delete", sql);
  });
};

// For get all brand data
export const bulkBrand = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-brand-bulk-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-brand-bulk", sql);
  });
};
