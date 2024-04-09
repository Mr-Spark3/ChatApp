const express = require("express");
const path = require("path");
const logger = require("morgan");

const port = process.env.PORT || 3001;

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "build")));

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Initialize Socket.IO
const io = require("./config/socket").init(server);

io.on("connection", (socket) => {
  console.log(socket);
  socket.on("newMsg", function (msg) {
    console.log("incoming message:", msg);
    socket.broadcast.emit("newChat", msg);
  });
});
