import { Request, Response, NextFunction } from "express";

import Comment from "../models/comment.model";
import { createErrorResponse } from "../utils/error";

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { content, postId } = req.body;

    const newComment = new Comment({
      content,
      postId,
      userId: req.user?.id?.toString(),
    });
    await newComment.save();

    res.status(200).json({
      status: "success",
      data: newComment,
      message: "Comment created",
    });
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res
      .status(200)
      .json({ status: "success", data: comments, message: "Comments found" });
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(createErrorResponse(404, "Comment not found"));
    }

    const update = comment.likes.includes(req.user?.id)
      ? { $inc: { numberOfLikes: -1 }, $pull: { likes: req.user?.id } }
      : { $inc: { numberOfLikes: 1 }, $addToSet: { likes: req.user?.id } };

    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      update,
      { new: true }
    );
    res.status(200).json({
      status: "success",
      data: updatedComment,
      message: "Comment updated",
    });
  } catch (error) {
    next(error);
  }
};

export const editComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(createErrorResponse(404, "Comment not found"));
    }

    if (
      comment.userId.toString() !== req.user?.id.toString() &&
      !req.user?.isAdmin
    ) {
      return next(
        createErrorResponse(403, "You are not allowed to edit this comment")
      );
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      data: editedComment,
      message: "Comment has been edited.",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(createErrorResponse(404, "Comment not found"));
    }

    if (
      comment.userId.toString() !== req.user?.id.toString() &&
      !req.user?.isAdmin
    ) {
      return next(
        createErrorResponse(403, "You are not allowed to delete this comment")
      );
    }

    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json({
      status: "success",
      data: null,
      message: "Comment has been deleted",
    });
  } catch (error) {
    next(error);
  }
};

export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.isAdmin) {
    return next(
      createErrorResponse(403, "You are not allowed to get all comments")
    );
  }

  const startIndex = parseInt(req.query.startIndex as string) || 0;
  const limit = parseInt(req.query.limit as string) || 9;
  const sortDirection = req.query.sort === "desc" ? -1 : 1;

  try {
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const [comments, totalComments, lastMonthComments] = await Promise.all([
      Comment.find()
        .sort({ createdAt: sortDirection })
        .skip(startIndex)
        .limit(limit),
      Comment.countDocuments(),
      Comment.countDocuments({ createdAt: { $gte: oneMonthAgo } }),
    ]);

    res.status(200).json({
      status: "success",
      data: { comments, totalComments, lastMonthComments },
      message: "Comments retrieved successfully.",
    });
  } catch (error) {
    next(error);
  }
};
