const electron = window.require("electron");

const { ipcRenderer } = electron;

// For get all cash data
export const getCash = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-cash-get-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-cash-get", sql);
  });
};

// For get all cash data
export const todayCash = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-cash-today-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-cash-today", sql);
  });
};

// For get all cash data
export const searchCash = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-cash-search-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-cash-search", sql);
  });
};

// For add cash data
export const addCash = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-cash-add-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-cash-add", sql);
  });
};

// For edit cash data
export const editCash = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-cash-edit-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-cash-edit", sql);
  });
};

// For delete the cash data
export const deleteCash = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-cash-delete-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-cash-delete", sql);
  });
};
