const electron = window.require("electron");

const { ipcRenderer } = electron;

// For get all bank data
export const getBank = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-bank-get-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-bank-get", sql);
  });
};

// For add bank data
export const addBank = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-bank-add-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-bank-add", sql);
  });
};

// For edit bank data
export const editBank = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-bank-edit-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-bank-edit", sql);
  });
};

// For delete the bank data
export const deleteBank = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-bank-delete-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-bank-delete", sql);
  });
};

// For get all bank data
export const bulkBank = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-bank-bulk-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-bank-bulk", sql);
  });
};
