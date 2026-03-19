import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import expressSession from "express-session"
import MongoStore from "connect-mongo"
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

// CORS 
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);


app.use(
  expressSession({
    secret: process.env.JWT_SECRET || "yourSecretKey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI || "mongodb://localhost:27017/todo-app",
      collectionName: "sessions", 
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: false, 
    },
  })
);


//Body Parsers 
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Health Check 
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running." });
});

// API Routes 
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// 404 Handler 
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// Global Error Handler 
app.use(errorHandler);

export default app;
