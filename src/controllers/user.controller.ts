import { Request, Response, NextFunction } from "express";
import bcryptjs from "bcryptjs";

import { createErrorResponse } from "../utils/error";
import User from "../models/user.model";

const hashPassword = (password: string) => bcryptjs.hashSync(password, 10);

// Helper function for validating username
const validateUsername = (username: string) => {
  const regex = /^[a-zA-Z0-9]+$/;
  if (username.length < 7 || username.length > 20)
    return "Username must be between 7 and 20 characters";
  if (username.includes(" ")) return "Username cannot contain spaces";
  if (username !== username.toLowerCase()) return "Username must be lowercase";
  if (!regex.test(username))
    return "Username can only contain letters and numbers";
  return null;
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.id !== req.params.userId) {
    return next(
      createErrorResponse(403, "You are not allowed to update this user")
    );
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(
        createErrorResponse(400, "Password must be at least 6 characters")
      );
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        createErrorResponse(400, "Username must be between 7 and 20 characters")
      );
    }
    if (req.body.username.includes(" ")) {
      return next(createErrorResponse(400, "Username cannot contain spaces"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(createErrorResponse(400, "Username must be lowercase"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        createErrorResponse(
          400,
          "Username can only contain letters and numbers"
        )
      );
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    ).lean();

    if (!updatedUser) {
      return next(createErrorResponse(404, "User not found"));
    }

    const { password, ...rest } = updatedUser;
    res.status(200).json({
      status: "success",
      data: rest,
      message: "User updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.isAdmin && req.user?.id !== req.params.userId) {
    return next(
      createErrorResponse(403, "You are not allowed to delete this user")
    );
  }
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId);

    if (!deletedUser) {
      return next(createErrorResponse(404, "User not found"));
    }
    res.status(200).json({
      status: "success",
      data: null,
      message: "User has been deleted",
    });
  } catch (error) {
    next(error);
  }
};

export const signout = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("access_token").status(200).json({
      status: "success",
      data: null,
      message: "User has been signed out",
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.isAdmin) {
    return next(
      createErrorResponse(403, "You are not allowed to see all users")
    );
  }
  try {
    const startIndex = parseInt(req.query.startIndex as string) || 0;
    const limit = parseInt(req.query.limit as string) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const [users, totalUsers, lastMonthUsers] = await Promise.all([
      User.find()
        .sort({ createdAt: sortDirection })
        .skip(startIndex)
        .limit(limit)
        .lean(),
      User.countDocuments(),
      User.countDocuments({
        createdAt: {
          $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        },
      }),
    ]);

    const usersWithoutPassword = users.map(({ password, ...rest }) => rest);

    res.status(200).json({
      status: "success",
      data: {
        users: usersWithoutPassword,
        totalUsers,
        lastMonthUsers,
      },
      message: "Users retrieved successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.userId).lean();

    if (!user) {
      return next(createErrorResponse(404, "User not found"));
    }

    const { password, ...rest } = user;
    res
      .status(200)
      .json({
        status: "success",
        data: rest,
        message: "User retrieved successfully.",
      });
  } catch (error) {
    next(error);
  }
};
