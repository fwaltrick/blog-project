import type { Request, Response } from "express";
import { PostsModel } from "../models/PostsModel";

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
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    const action = isEdit ? "updated" : "created";
    return res.status(isEdit ? 200 : 201).json({
      success: true,
      message: `Post ${action} successfully`,
      post: result,
    });
  } catch (error) {
    console.error(
      `Error ${req.params.id ? "updating" : "creating"} post:`,
      error,
    );

    const action = req.params.id ? "update" : "creation";
    return res.status(500).json({
      success: false,
      error: `Post ${action} failed`,
      message: "An error occurred while processing your request",
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
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({
      success: false,
      error: "Post deletion failed",
      message: "An error occurred while deleting the post",
    });
  }
};
