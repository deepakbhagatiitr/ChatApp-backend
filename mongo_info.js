const mongoose = require('mongoose');
require('dotenv').config(); // To load environment variables

const MONGODB_URI = process.env.MONGODB_URI; // As you stored your MongoDB URI in an environment variable

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
// Define the schema for a single message
const messageSchema = new mongoose.Schema({
    room:String,
    sender: String,
    receiver: String,
    message:String,
    time:String
});



// Create a model for the chat conversation
const Chat = mongoose.model('chatinfo', messageSchema);

module.exports = Chat;
