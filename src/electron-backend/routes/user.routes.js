const electron = window.require("electron");

const { ipcRenderer } = electron;

// For get all user data
export const getUser = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-user-get-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-user-get", sql);
  });
};

// For get all user data
export const getOneUser = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-user-one-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-user-one", sql);
  });
};

// For edit user data
export const editUser = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-user-edit-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-user-edit", sql);
  });
};
