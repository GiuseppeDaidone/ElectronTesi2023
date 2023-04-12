const elect = require('electron');
const app = elect.app;
const path = require('path');
const url = require('url');
const Tray = elect.Tray;
const iconPath = path.join(__dirname, 'icon.png');

let tray = null;

const express = require('express');
const http = require('http');
const { electron } = require('process');

const appServer = express();
const server = http.Server(appServer);
const port = process.env.PORT || 3000;

appServer.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

server.listen(port, function() {
  console.log("Listening on *:" + port);
});

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })

  mainWindow.loadFile('main.html');
}

app.whenReady().then(() => {
  tray = new Tray(iconPath);
  tray.setToolTip('ChatApp Server is running');

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      tray = new Tray(iconPath);
      tray.setToolTip('ChatApp Server is running');
    }
  });
});