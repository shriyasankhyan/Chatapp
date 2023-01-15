const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const messageRoutes = require("./routes/messageRoutes");
const app = express();
dotenv.config();


connectDB();
// To accept JSON data.
app.use(express.json()); // to accept JSON files.

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("API is running successfully");
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use("/api/message", messageRoutes);

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, console.log(`Server started on Port ${PORT}.`));

const io = require("socket.io")(server, {
    pingTimeOut: 60000,
    cors: {
        origin: "http://localhost:3000"
    },
});

io.on("connection", (socket) => {
    console.log(`Connected to Socket.io`);
    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("User joined room " + room);
    });

    socket.on('new message', (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if (!chat.users) return console.log("chat.users not defined.");
        // If I am the user, the message should reach others, but not me.
        chat.users.forEach(user => {
            if (user._id == newMessageReceived.sender._id) {
                return;
            }

            socket.in(user._id).emit("message received", newMessageReceived);
        });

    });
});


