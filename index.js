const Electron = require("electron");
const { app, BrowserWindow, nativeImage } = Electron;
const { argv } = require("yargs");

const icon = nativeImage.createFromPath("./resources/eliot.ico");
const BROWSER_WINDOW_CONFIG = {
  icon,
  show: false,
  frame: false,
  width: 1280,
  height: 720,
  minWidth: 640,
  minHeight: 360,
  backgroundColor: "#222222",
  webPreferences: { nodeIntegration: true },
};

let mainWindow = null;

app.whenReady().then(async () => {
  mainWindow = new BrowserWindow(BROWSER_WINDOW_CONFIG);
  if (argv.url) mainWindow.loadURL(argv.url); else mainWindow.loadFile("./index.html");
  mainWindow.webContents.openDevTools();

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
});

app.on("window-all-closed", () => {
  process.exit();
});
