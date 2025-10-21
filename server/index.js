const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("Kullanıcı bağlandı:", socket.id);

  // Odaya katılma
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`${socket.id} ${room} odasına katıldı`);
  });

  // Mesaj gönderme
  socket.on("send_message", (data) => {
    console.log("Mesaj:", data);
    io.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("Kullanıcı ayrıldı:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server 5000 portunda çalışıyor");
});