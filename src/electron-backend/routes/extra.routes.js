const electron = window.require("electron");
const { ipcRenderer } = electron;

// For close window
export const closeWindow = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-closeWindow-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-closeWindow", sql);
  });
};

// For minimize window
export const minimize = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-minimize-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-minimize", sql);
  });
};

// For hide window
export const hide = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-hide-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-hide", sql);
  });
};

// For maximize window
export const maximize = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-maximize-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-maximize", sql);
  });
};

// For unmaximize window
export const unmaximize = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-unmaximize-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-unmaximize", sql);
  });
};

// For unmaximize window
export const reload = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-reload-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-reload", sql);
  });
};

// For unmaximize window
export const otpMail = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-mail-otp-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-mail-otp", sql);
  });
};

export const backupDataBase = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-backup-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-backup", sql);
  });
};

export const update = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-update-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-update", sql);
  });
};

export const getPassbookData = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-passbook-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-passbook", sql);
  });
};

export const addPassbook = (sql) => {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-passbook-generate-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-passbook-generate", sql);
  });
};
