const electron = require("electron");

require("../src/electron-backend/main");

const { app, dialog, BrowserWindow, Menu, Tray } = electron;

const path = require("path");
const isDev = require("electron-is-dev"); // To check if electron is in development mode

let mainWindow;
let tray;

// Initializing the Electron Window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200, // width of window
    height: 600, // height of window

    skipTaskbar: false,

    hasShadow: false,
    roundedCorners: true,
    show: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });

  mainWindow.maximize();
  tray = new Tray(path.join(__dirname, "task.png"));

  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "Show App",
        click: function () {
          mainWindow.show();
        },
      },
      {
        label: "Quit",
        click: function () {
          application.isQuiting = true;
          application.quit();
        },
      },
    ])
  );
  // Loading a webpage inside the electron window we just created Loading localhost if dev mode  Loading build file if in production
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  // Setting Window Icon - Asset file needs to be in the public/images folder.
  mainWindow.setIcon(path.join(__dirname, "favicon6.ico"));

  // In development mode, if the window has loaded, then load the dev tools.
  // if (isDev) {
  //   mainWindow.webContents.on("did-frame-finish-load", () => {
  //     mainWindow.webContents.openDevTools({ detach: true });
  //   });
  // }

  mainWindow.webContents.on("ready-to-show", () => {
    mainWindow.show();
  });
}

app.on("ready", createWindow);
app.setLoginItemSettings({
  openAtLogin: true,
  openAsHidden: true,
  path: app.getPath("exe"),
});
// Exiting the app
// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") {
//     app.quit();
//   }
// });

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
