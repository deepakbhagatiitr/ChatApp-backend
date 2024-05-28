const express = require("express");
const { Server } = require("socket.io");
const collection = require("./mongo_user");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}));

// Create an HTTP server using Express
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Attach Socket.IO to the HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  }
});

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (Username) => {
    socket.join(Username);
    console.log(`User with ID: ${socket.id} joined room: ${Username}`);
  });
  socket.on('leaveRoom', (roomName) => {
    socket.leave(roomName);
    console.log(`Socket ${socket.id} left room ${roomName}`);
  });

  socket.on("send_message", (messageData) => {
    socket.to(messageData.room).emit("receive_message", messageData);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// Express routes
app.get("/", async (req, res) => {

  let data = await collection.find({});
  res.send(data);

});

app.post("/", async (req, res) => {
  const { Username, Password } = req.body;


  const check = await collection.findOne({
    Username: Username,
    Password: Password
  });

  if (check) {
    res.send("exist");
  } else {
    res.send("notexist");
  }

});

app.post("/register", async (req, res) => {
  const { Username, Email, Password } = req.body;


  const check = await collection.findOne({
    Email: Email
  });

  if (check) {
    res.json("exist");
  } else {
    const data = {
      Username: Username,
      Email: Email,
      Password: Password
    };
    await collection.insertMany([data]);
    res.json("notexist");
  }

});
