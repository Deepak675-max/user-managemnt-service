const express = require("express");
const JWT = require("jsonwebtoken");
const userManagementBackendApp = express();
const httpErrors = require("http-errors");
const httpServer = require("http").createServer(userManagementBackendApp);
const socketio = require("socket.io")(httpServer);

socketio.on('connection', (socket) => {
  console.log('A user connected');
  // Handle events here
  // For example, listen for a task update event and broadcast it to connected clients
  socket.on('taskUpdate', (data) => {
    socketio.emit('taskUpdated', data); // Broadcast to all connected clients
  });
});


module.exports = {
  userManagementBackendApp,
  httpServer,
  socketio,
};
