const electron = window.require("electron");

const { ipcRenderer } = electron;

// For get all bank-ledger data
export const getBank = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-bank-ledger-get-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-bank-ledger-get", sql);
  });
};

// For get all bank-ledger data
export const todayBank = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-bank-ledger-today-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-bank-ledger-today", sql);
  });
};

// For get all bank-ledger data
export const searchBank = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-bank-ledger-search-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-bank-ledger-search", sql);
  });
};

// For add bank-ledger data
export const addBank = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-bank-ledger-add-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-bank-ledger-add", sql);
  });
};

// For edit bank-ledger data
export const editBank = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-bank-ledger-edit-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-bank-ledger-edit", sql);
  });
};

// For delete the bank-ledger data
export const deleteBank = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-bank-ledger-delete-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-bank-ledger-delete", sql);
  });
};
