const electron = window.require("electron");

const { ipcRenderer } = electron;

// For get all po data
export const getPO = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-po-get-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-po-get", sql);
  });
};

// For add po data
export const addPO = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-po-add-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-po-add", sql);
  });
};

// For add po data
export const editPOList = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-po-edit-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-po-edit", sql);
  });
};

// For add po data
export const deletePO = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-po-delete-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-po-delete", sql);
  });
};

// For add po data
export const deletePOList = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-po-list-delete-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-po-list-delete", sql);
  });
};
