const path = require("path");
const http = require("http");
const express = require("express");
const soketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = soketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "Chatcord Bot";
// Run when client connets
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    //Welcome current user
    socket.emit("message", formatMessage(username, "Welcome to ChatCord!"));

    //Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(username, `${user.username} has joined the chat`)
      );

    //Send users and roo info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Runs when client disconnects
  socket.on("disconnet", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      //Send users and roo info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });

  //Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });
});

const PORT = 3000 || process.env.PORT;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
