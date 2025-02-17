import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";

import userRoutes from "./routes/user.route.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import rateLimiter from "./middlewares/rateLimiter.js";

dotenv.config();

const app = express();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log(err);
  });

// Middleware
app.use(helmet()); // Security Headers
app.use(cookieParser());
app.use(cors()); // Enable CORS
app.use(express.json()); // JSON Parser
app.use(express.urlencoded({ extended: true })); // URL Encoded Parser
app.use(rateLimiter);

// Routes
app.use("/api/v1/user", userRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Graceful Shutdown
const shutdown = () => {
  console.log("Shutting down gracefully...");
  mongoose.connection.close(() => {
    console.log("MongoDB disconnected");
    process.exit(0);
  });
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});
