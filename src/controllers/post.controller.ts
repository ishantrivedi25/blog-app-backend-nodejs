import { Request, Response, NextFunction } from "express";

import Post from "../models/post.model";
import { createErrorResponse } from "../utils/error";

// Helper function for slug generation
const generateSlug = async (title: string) => {
  let slug = title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");
  const existingPost = await Post.findOne({ slug });
  if (existingPost) {
    slug = `${slug}-${Date.now()}`;
  }
  return slug;
};

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.isAdmin) {
    return next(
      createErrorResponse(403, "You are not allowed to create a post")
    );
  }

  if (!req.body.title || !req.body.content) {
    return next(createErrorResponse(400, "Please provide all required fields"));
  }

  const slug = await generateSlug(req.body.title);
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedPost = await newPost.save();
    res.status(201).json({
      status: "success",
      data: savedPost,
      message: "Post created successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const startIndex = parseInt(req.query.startIndex as string) || 0;
    const limit = parseInt(req.query.limit as string) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const queryFilters = {
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    };

    // Fetch posts and counts in parallel
    const [posts, totalPosts, lastMonthPosts] = await Promise.all([
      Post.find(queryFilters)
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit),
      Post.countDocuments(),
      Post.countDocuments({
        createdAt: {
          $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        },
      }),
    ]);

    res.status(200).json({
      status: "success",
      data: { posts, totalPosts, lastMonthPosts },
      message: "Posts retrieved successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.isAdmin || req.user?.id !== req.params.userId) {
    return next(
      createErrorResponse(403, "You are not allowed to delete this post")
    );
  }
  try {
    const post = await Post.findByIdAndDelete(req.params.postId);

    if (!post) {
      return next(createErrorResponse(404, "Post not found"));
    }
    res.status(200).json({
      status: "success",
      data: null,
      message: "Post has been deleted.",
    });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.isAdmin || req.user?.id !== req.params.userId) {
    return next(
      createErrorResponse(403, "You are not allowed to update this post")
    );
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );

    if (!updatedPost) {
      return next(createErrorResponse(404, "Post not found"));
    }

    res.status(200).json({
      status: "success",
      data: updatedPost,
      message: "Post has been updated.",
    });
  } catch (error) {
    next(error);
  }
};
