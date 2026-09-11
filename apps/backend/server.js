import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.js";
import listRoutes from "./routes/list.js";
import taskRoutes from "./routes/task.js";
import { ErrorMessage } from "./utils/constants.js";

dotenv.config();
const { DB_HOST, PORT, FRONTEND_URL } = process.env;
const port = PORT || 3001;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Behind Railway's proxy, so the rate limiters see the client IP
// instead of rate limiting the proxy itself.
app.set("trust proxy", 1);

app.use(express.json({ limit: "10kb" }));
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.options("*", cors());

// Declared before the limiters so platform health checks are never throttled.
app.get("/health", (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res
    .status(isDbConnected ? 200 : 503)
    .json({ status: isDbConnected ? "ok" : "degraded", db: isDbConnected });
});

// Signup and login are the only routes an anonymous visitor can reach, and
// bcrypt makes them the most expensive ones, so they get a tighter limit.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: ErrorMessage.tooManyAuthAttempts },
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: ErrorMessage.tooManyRequests },
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/lists", apiLimiter, listRoutes);
app.use("/api/tasks", apiLimiter, taskRoutes(io));

// Body parser failures would otherwise return Express's HTML error page to a
// client that is expecting JSON.
app.use((error, req, res, next) => {
  if (error.type === "entity.too.large") {
    return res.status(413).json({ error: ErrorMessage.payloadTooLarge });
  }
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ error: ErrorMessage.invalidJson });
  }
  return next(error);
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("joinRoom", (listId) => {
    socket.join(listId);
    console.log(`Socket ${socket.id} joined room: ${listId}`);
  });

  socket.on("leaveRoom", (listId) => {
    socket.leave(listId);
    console.log(`Socket ${socket.id} left room: ${listId}`);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Connect before listening: without a database every request would otherwise
// hang on Mongoose's buffer and then fail, with the server still reporting healthy.
try {
  await mongoose.connect(DB_HOST, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
  });
  console.log("MongoDB connected");
} catch (error) {
  console.error(`MongoDB connection failed: ${error.message}`);
  process.exit(1);
}

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
