const electron = window.require("electron");
const { ipcRenderer } = electron;

// For get all invoice data
export const getInvoice = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-invoice-get-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-invoice-get", sql);
  });
};

// For get all invoice data
export const getOneInvoice = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-invoice-one-get-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-invoice-one-get", sql);
  });
};

// For add invoice data
export const saveOneInvoice = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-saves-one-get-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-saves-one-get", sql);
  });
};

// For add invoice data
export const saveDeleteInvoice = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-saves-delete-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-saves-delete", sql);
  });
};

export const saveGetInvoice = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-saves-get-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-saves-get", sql);
  });
};

// For add invoice data
export const addInvoice = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-invoice-add-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-invoice-add", sql);
  });
};

// For add invoice data
export const addInvoice2 = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-invoice-add2-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-invoice-add2", sql);
  });
};

// For add invoice data
export const saveInvoice = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-invoice-save-add-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-invoice-save-add", sql);
  });
};

// For delete the invoice data
export const deleteInvoice = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-invoice-delete-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-invoice-delete", sql);
  });
};
