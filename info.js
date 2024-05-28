const express = require("express");
const collection = require("./mongo_info");
const cors = require("cors");
const app = express();
app.use(express.json());

app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
}));

// Route to get messages by room
app.get("/:room", async (req, res) => {
    const room = req.params.room;
    let data = await collection.find({ room: room });
    res.send(data);
});

// Route to post a message in a room
app.post("/:room", async (req, res) => {
    const room = req.params.room;
    const { sender, receiver, message, time } = req.body;

    const data = {
        room: room,
        sender: sender,
        receiver: receiver,
        message: message,
        time: time
    };

    try {
        const check = await collection.insertMany([data]);
        res.send("Message added successfully");
    } catch (error) {
        console.error("Error adding message:", error);
        res.status(500).send("Error adding message");
    }
});

const port = 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
