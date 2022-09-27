const electron = window.require("electron");

const { ipcRenderer } = electron;

// For get all reminder data
export const getReminder = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-reminder-get-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-reminder-get", sql);
  });
};

// For add reminder data
export const addReminder = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-reminder-add-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-reminder-add", sql);
  });
};

// For edit reminder data
export const todayReminder = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-reminder-today-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-reminder-today", sql);
  });
};

// For delete the reminder data
export const deleteReminder = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-reminder-delete-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-reminder-delete", sql);
  });
};
