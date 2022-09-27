const electron = window.require("electron");
const { ipcRenderer } = electron;

// For register new user
export const register = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-register-get-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-register-get", sql);
  });
};

// For login existence users
export const login = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-login-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-login-get", sql);
  });
};

// For user count existence users
export const userCount = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-user-count-get-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-user-count-get", sql);
  });
};
