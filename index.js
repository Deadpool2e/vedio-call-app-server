const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("user connected with id", socket.id);
  socket.emit("me", socket.id);

  socket.on("disconnect", () => { 
    console.log("user disconnected having id", socket.id);
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

  socket.on("endCall", ({ id }) => {
    io.to(id).emit("endCall");
  });
});

server.listen(5000, () => console.log("server is running on port 5000"));
