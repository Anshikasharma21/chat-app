import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

const app = express();

// create HTTP server (renamed to avoid conflict)
const httpServer = http.createServer(app);

// initialize socket.io server
export const io = new Server(httpServer, {
  cors: { origin: "*" }
});

// store online users
export const userSocketMap = {}; // userID: socket id

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  console.log("User Connected:", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected:", userId);

    delete userSocketMap[userId];

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// routes
app.use("/api/status", (req, res) => {
  res.send("server is live");
});
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// function to start server
const startServer = async () => {
  try {
    await connectDB();

    const port = process.env.PORT || 5000;

    httpServer.listen(port, () => {
      console.log("Server is running on port: " + port);
    });
  } catch (error) {
    console.log("Server error:", error.message);
  }
};

startServer();