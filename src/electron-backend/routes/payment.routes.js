const electron = window.require("electron");

const { ipcRenderer } = electron;

// For add payment details for invoice
export const addPayment = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-payment-add-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-payment-add", sql);
  });
};

// For adding journal data
export const addJournal = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-journal-add-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-journal-add", sql);
  });
};

// For get all payments and journal
export const getPayments = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-payment-get-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-payment-get", sql);
  });
};
