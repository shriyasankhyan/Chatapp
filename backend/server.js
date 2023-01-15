const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const messageRoutes = require("./routes/messageRoutes");
const app = express();
const path = require('path');
dotenv.config();


connectDB();
// To accept JSON data.
app.use(express.json()); // to accept JSON files.

const PORT = process.env.PORT || 5000;

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use("/api/message", messageRoutes);

// -------------------------Deployment-----------------------

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
    // Establishing the path from current working directory to the build folder of our frontend. Run npm run build in frontend directory.
    app.use(express.static(path.join(__dirname1, '/frontend/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname1, "fronten", "build", "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.send("API is running successfully");
    });
}

// -------------------------Deployment-----------------------

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

    socket.on('typing', (room) =>
        socket.in(room).emit('typing')
    )

    socket.on('stop typing', (room) =>
        socket.in(room).emit('stop typing')
    )

    socket.on('new message', (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if (!chat.users) return console.log("chat.users not defined.");
        // If I am the user, the message should reach others, but not me.
        chat.users.forEach(user => {
            if (user._id === newMessageReceived.sender._id) {
                return;
            }

            socket.in(user._id).emit("message received", newMessageReceived);
        });

    });

    socket.off('setup', () => {
        console.log("User disconnected");
        socket.leave(userData._id);
    });
});


