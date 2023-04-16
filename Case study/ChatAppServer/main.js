const elect = require('electron');
const app = elect.app;
const path = require('path');
const url = require('url');
const Tray = elect.Tray;
const iconPath = path.join(__dirname, 'icon.png');

let tray = null;

const { Server } = require('socket.io');
const express = require('express');
const http = require('http');
const { electron } = require('process');

const appServer = express();
const server = http.Server(appServer);
const io = require('socket.io')(server, {
  cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      transports: ['websocket', 'polling'],
      credentials: true
  },
  allowEIO3: true
});
const port = 3000;

appServer.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket) {
  socket.on("user_join", function(data) {
      this.username = data;
      socket.broadcast.emit("user_join", data);
  });

  socket.on("chat_message", function(data) {
      data.username = this.username;
      socket.broadcast.emit("chat_message", data);
  });

  socket.on("disconnect", function(data) {
      socket.broadcast.emit("user_leave", this.username);
  });
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