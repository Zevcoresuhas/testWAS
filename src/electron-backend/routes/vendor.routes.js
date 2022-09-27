const electron = window.require("electron");

const { ipcRenderer } = electron;

// For get all vendor data
export const getVendor = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-vendor-get-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-vendor-get", sql);
  });
};

// For add vendor data
export const addVendor = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-vendor-add-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-vendor-add", sql);
  });
};

// For edit vendor data
export const editVendor = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-vendor-edit-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-vendor-edit", sql);
  });
};

// For delete the vendor data
export const deleteVendor = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-vendor-delete-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-vendor-delete", sql);
  });
};

// For get all vendor data
export const bulkVendor = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-vendor-bulk-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-vendor-bulk", sql);
  });
};
