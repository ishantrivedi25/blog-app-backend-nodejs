import { Request, Response, NextFunction } from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.model";
import { createErrorResponse } from "../utils/error";

interface MongoError extends Error {
  code?: number;
}

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(createErrorResponse(400, "All fields are required"));
  }

  try {
    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res
      .status(201)
      .json({ status: "success", data: null, message: "Signup successful" });
  } catch (err) {
    const error = err as MongoError;

    if (error.name === "MongoServerError" && error.code === 11000) {
      return next(createErrorResponse(400, "Username/Email already exists."));
    }

    return next(createErrorResponse(500, "Something went wrong"));
  }
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createErrorResponse(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(createErrorResponse(404, "User not found"));
    }

    const validPassword = await bcryptjs.compare(password, validUser.password);
    if (!validPassword) {
      return next(createErrorResponse(400, "Invalid password"));
    }

    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const validUserObj = validUser.toObject();

    const { password: pass, ...rest } = validUserObj;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ status: "success", data: rest, message: "Signin successful" });
  } catch (error) {
    next(error);
  }
};

export const google = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, name, googlePhotoUrl } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      const generatedPassword = crypto.randomBytes(16).toString("hex");
      const hashedPassword = await bcryptjs.hash(generatedPassword, 10);

      user = new User({
        username:
          name.toLowerCase().replace(/\s/g, "") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });

      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );
    const newUserObj = user.toObject();
    const { password, ...rest } = newUserObj;
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ status: "success", data: rest, message: "Signin successful" });
  } catch (error) {
    next(error);
  }
};
