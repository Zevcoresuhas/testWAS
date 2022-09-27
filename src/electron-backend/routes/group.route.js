const electron = window.require("electron");
const { ipcRenderer } = electron;

// For get all group data
export const getGroup = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-group-get-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-group-get", sql);
  });
};

// For add group data
export const addGroup = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-group-add-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-group-add", sql);
  });
};

// For edit group data
export const editGroup = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-group-edit-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-group-edit", sql);
  });
};

// For delete the group data
export const deleteGroup = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-group-delete-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-group-delete", sql);
  });
};

// For get all group data
export const bulkGroup = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-group-bulk-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-group-bulk", sql);
  });
};
