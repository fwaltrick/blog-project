import type { Request, Response } from "express";
import { PostsModel } from "../models/PostsModel";

// Helper function to handle JSON/redirect responses
const handleResponse = (
  req: Request,
  res: Response,
  options: {
    success: boolean;
    statusCode: number;
    jsonData?: any;
    redirectUrl: string;
    errorMessage?: string;
  },
) => {
  const { success, statusCode, jsonData, redirectUrl, errorMessage } = options;

  if (req.headers.accept?.includes("application/json")) {
    return res.status(statusCode).json(jsonData);
  }

  return res.redirect(redirectUrl);
};

// List all posts for admin
export const adminPostsListController = (req: Request, res: Response) => {
  const posts = PostsModel.getAllPosts();
  res.render("admin/posts-list", {
    meta: { title: "Manage Posts" },
    posts,
  });
};

// Show create/edit post form
export const adminPostFormController = (req: Request, res: Response) => {
  const id = req.params.id;

  if (id) {
    // Edit mode
    const post = PostsModel.getPostById(id);
    if (!post) {
      return res.status(404).render("404", {
        meta: { title: "Post Not Found" },
      });
    }

    res.render("admin/post-form", {
      meta: { title: `Edit: ${post.title}` },
      post,
      id,
      isEdit: true,
    });
  } else {
    // Create mode
    res.render("admin/post-form", {
      meta: { title: "Create New Post" },
      isEdit: false,
      currentTimestamp: Math.floor(Date.now() / 1000),
    });
  }
};

// Handle create/edit post submission
export const adminPostSubmitController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = req.params.id;
    const { title, author, teaser, content, image, createdAt } = req.body;
    const isEdit = !!id;

    let result;
    if (isEdit) {
      // When editing, preserve the original createdAt from the existing post
      const existingPost = PostsModel.getPostById(id);
      result = PostsModel.updatePost(id, {
        title,
        author,
        teaser,
        content,
        image,
        createdAt:
          existingPost?.createdAt ||
          parseInt(createdAt) ||
          Math.floor(Date.now() / 1000),
      });
    } else {
      // When creating, use the provided createdAt or current timestamp
      result = PostsModel.addPost({
        title,
        author,
        teaser,
        content,
        image,
        createdAt: parseInt(createdAt) || Math.floor(Date.now() / 1000),
      });
    }

    if (!result && isEdit) {
      return handleResponse(req, res, {
        success: false,
        statusCode: 404,
        jsonData: { success: false, error: "Post not found" },
        redirectUrl: "/admin/posts?error=post_not_found",
      });
    }

    const action = isEdit ? "updated" : "created";
    return handleResponse(req, res, {
      success: true,
      statusCode: isEdit ? 200 : 201,
      jsonData: { success: true, post: result },
      redirectUrl: `/admin/posts?success=${action}`,
    });
  } catch (error) {
    console.error(
      `Error ${req.params.id ? "updating" : "creating"} post:`,
      error,
    );

    const action = req.params.id ? "update" : "creation";
    const fallbackUrl = req.params.id
      ? `/admin/posts/${req.params.id}/edit?error=${action}_failed`
      : "/admin/posts/new?error=creation_failed";

    return handleResponse(req, res, {
      success: false,
      statusCode: 500,
      jsonData: { success: false, error: `${action} failed` },
      redirectUrl: fallbackUrl,
    });
  }
};

// Handle delete post
export const adminDeletePostController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = req.params.id;
    const success = PostsModel.deletePost(id);

    if (!success) {
      return handleResponse(req, res, {
        success: false,
        statusCode: 404,
        jsonData: { success: false, error: "Post not found" },
        redirectUrl: "/admin/posts?error=post_not_found",
      });
    }

    return handleResponse(req, res, {
      success: true,
      statusCode: 200,
      jsonData: { success: true, message: "Post deleted successfully" },
      redirectUrl: "/admin/posts?success=deleted",
    });
  } catch (error) {
    console.error("Error deleting post:", error);

    return handleResponse(req, res, {
      success: false,
      statusCode: 500,
      jsonData: { success: false, error: "Deletion failed" },
      redirectUrl: "/admin/posts?error=deletion_failed",
    });
  }
};
