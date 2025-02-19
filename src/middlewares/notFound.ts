import { Request, Response, NextFunction } from "express";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: "error",
    data: null,
    message: `Not Found - ${req.originalUrl}`,
  });
};
