import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { fromError } from "zod-validation-error";
import logger from "../utils/logger";

export function validateData(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromError(error);
        logger.error(validationError.toString());
        res.status(400).json({
          status: "error",
          data: null,
          message: validationError.toString(),
        });
      } else {
        logger.error(error);
        res.status(500).json({
          status: "error",
          data: null,
          message: "Internal Server Error",
        });
      }
    }
  };
}
