const electron = window.require("electron");
const { ipcRenderer } = electron;

// For get all subgroup data
export const getSubgroup = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-subgroup-get-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-subgroup-get", sql);
  });
};

// For add subgroup data
export const addSubgroup = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-subgroup-add-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-subgroup-add", sql);
  });
};

// For edit subgroup data
export const editSubgroup = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-subgroup-edit-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-subgroup-edit", sql);
  });
};

// For delete the subgroup data
export const deleteSubgroup = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-subgroup-delete-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-subgroup-delete", sql);
  });
};

// For delete the subgroup data
export const bulkSubgroup = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-subgroup-bulk-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-subgroup-bulk", sql);
  });
};
