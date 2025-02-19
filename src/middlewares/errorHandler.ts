import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

interface ErrorResponse extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err?.statusCode || 500;
  const message = err?.message || "Internal Server Error";

  // Log the error using Winston
  logger.error(err);

  res.status(statusCode).json({
    status: "error",
    data: null,
    message,
  });
};
