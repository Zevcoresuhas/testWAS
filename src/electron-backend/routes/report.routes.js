const electron = window.require("electron");
const { ipcRenderer } = electron;

// For get all product data
export const getCustomerReport = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-customer-report-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-customer-report", sql);
  });
};

// For add product data
export const getKPI = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-kpi-report-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-kpi-report", sql);
  });
};

// For add product data
export const getHSN = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-hsn-report-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-hsn-report", sql);
  });
};

// For add product data
export const getDashboard = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-dashboard-report-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-dashboard-report", sql);
  });
};

// For add product data
export const getStockDepletion = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-stock-depletion-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-stock-depletion", sql);
  });
};

// For add product data
export const getProductHistory = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-product-history-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-product-history", sql);
  });
};

// For add product data
export const getProductHistoryDate = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-product-history-date-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-product-history-date", sql);
  });
};

// For add customer data history
export const getCustomerHistory = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-customer-history-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-customer-history", sql);
  });
};

// For add customer data history
export const getCustomerHistory2 = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-customer-history-reply2", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-customer-history2", sql);
  });
};

// For add customer data history
export const getCustomerHistoryDate = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-customer-history-date-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-customer-history-date", sql);
  });
};
