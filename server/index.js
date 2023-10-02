const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
let conectedUsers = [];
let createdRooms = [];
let messages = [];
io.on("connection", (socket) => {
  let id = socket.id;
  console.log("A user connected", socket.id);

  socket.on("join room", (user) => {
    console.log(user, "roomid");
    socket.join(user.roomId);

    if (!createdRooms.includes(user.roomId)) {
      createdRooms.push(user.roomId);
    }

    const filteredMessages = messages.filter(
      (msg) => msg.user.roomId === user.roomId
    );

    io.emit("join room", { joinedUser: user, sentMessages: filteredMessages });
    io.emit("created rooms", createdRooms);
  });

  socket.on("created rooms", (rooms) => {
    io.emit("created rooms", createdRooms);
  });

  //socket.on lyssnar på inkommande från frontend, io.emit skickar ut till front end
  socket.on("chat message", (msg) => {
    // console.log("emmit", msg);
    messages.push(msg);
    io.to(msg.user.roomId).emit("chat message", { ...msg });
  });

  socket.on("message typing", (user) => {
    console.log(user, "typing");
    io.to(user.roomId).emit("message typing", user);
  });

  //kolla över om vi ska ha den.... körs igen när man lägger till rum för frontend
  socket.on("user_connected", (user) => {
    // console.log(user, "DENNA CONNECTADe");
    conectedUsers.push({ socketId: socket.id, user });
    io.emit("user_connected", conectedUsers); // Emit the user list to all clients
  });

  socket.on("disconnect", () => {
    conectedUsers = conectedUsers.filter((user) => user.socketId !== id);
    io.emit("user_connected", conectedUsers);
    // console.log("A user disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
