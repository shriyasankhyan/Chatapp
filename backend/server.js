const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");

const app = express();
dotenv.config();
// API which shows "API is running" on / route. (Starting route)
app.get("/", (req, res) => {
    res.send("API is running."); 
});

// API which shows chats on /api/chat route.
app.get("/api/chat", (req, res) => {
    res.send(chats);
});

app.get('/api/chat/:id', (req, res) => {
    // console.log(req.params.id);
    const singleChat = chats.find(c => c._id === req.params.id);
    res.send(singleChat);
});


// Either use the port provided by process.env.PORT or 5000.
const PORT = process.env.PORT || 5000;

// Web Server
app.listen(PORT, console.log(`Server started on PORT ${PORT}`));
