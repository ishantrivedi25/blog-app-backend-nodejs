import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

import { createErrorResponse } from "./error";
import { IUser } from "../models/user.model";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createErrorResponse(401, "Unauthorized"));
  }
  jwt.verify(
    token,
    process.env.JWT_SECRET!,
    (err: VerifyErrors | null, user: JwtPayload | string | undefined) => {
      if (err) {
        return next(createErrorResponse(401, "Unauthorized"));
      }

      if (typeof user === "string" || !user) {
        return next(createErrorResponse(401, "Invalid token format"));
      }

      req.user = user as IUser;
      next();
    }
  );
};
