const electron = window.require("electron");

const { ipcRenderer } = electron;

// For get all account data
export const getAccount = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-account-get-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-account-get", sql);
  });
};

// For add account data
export const addAccount = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-account-add-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-account-add", sql);
  });
};
