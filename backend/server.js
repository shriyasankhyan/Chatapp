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

app.listen(PORT, console.log(`Server started on Port ${PORT}.`));

app.get("/", (req, res) => {
    res.send("API is running successfully");
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use("/api/message", messageRoutes);

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

