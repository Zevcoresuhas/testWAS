const electron = window.require("electron");
const { ipcRenderer } = electron;

// For get all estimate data
export const getEstimate = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-estimate-get-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-estimate-get", sql);
  });
};

// For get all estimate data
export const getOneEstimate = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-estimate-one-get-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-estimate-one-get", sql);
  });
};

// For add estimate data
export const addEstimate = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-estimate-add-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-estimate-add", sql);
  });
};

// For delete the estimate data
export const deleteEstimate = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-estimate-delete-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-estimate-delete", sql);
  });
};
