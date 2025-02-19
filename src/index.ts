import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRoutes from "./routes/user.route";
import authRoutes from "./routes/auth.route";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";
import rateLimiter from "./middlewares/rateLimiter";
import logger from "./utils/logger";

dotenv.config();

const app = express();

mongoose
  .connect(process.env.MONGODB_URL!)
  .then(() => {
    logger.info("MongoDB Connected Successfully");
  })
  .catch((err) => {
    logger.error(err);
  });

// Middleware
app.use(helmet()); // Security Headers
app.use(cookieParser());
app.use(cors()); // Enable CORS
app.use(express.json()); // JSON Parser
app.use(express.urlencoded({ extended: true })); // URL Encoded Parser
app.use(rateLimiter);

/** Example middleware to log every request */
app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/auth", authRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const shutdown = async () => {
  try {
    await mongoose.connection.close();
    logger.info("MongoDB disconnected");
    process.exit(0);
  } catch (error) {
    logger.error("Error closing MongoDB connection:", error);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}!`);
});
