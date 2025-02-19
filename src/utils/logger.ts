import { createLogger, format, transports } from "winston";

// Custom format for console logging with colors
const logFormat = format.combine(
  format.colorize(),
  format.timestamp(),
  format.errors({ stack: true }),
  format.printf(
    ({ timestamp, level, message }) => `${timestamp} [${level}] ${message}`
  )
);

// Create a Winston logger
const logger = createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new transports.Console({ format: logFormat }),
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/requests.log", level: "info" }),
  ],
});

export default logger;
