import type { Request, Response } from "express";
import { PostsModel } from "../models/PostsModel";
import sanitizeHtml from "sanitize-html";

// List all posts for admin (async, loads from DB)
export const adminPostsListController = async (req: Request, res: Response) => {
  await PostsModel.loadPosts();
  const posts = PostsModel.getAllPosts();
  res.render("admin/posts-list", {
    meta: { title: "Manage Posts" },
    posts,
  });
};

// Show create/edit post form
export const adminPostFormController = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (id) {
    // Edit mode
    await PostsModel.loadPosts();
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
    const cleanContent = sanitizeHtml(content);
    const isEdit = !!id;
    let result;
    let createdAtNum = Number(createdAt);
    if (!createdAt || isNaN(createdAtNum)) {
      createdAtNum = Math.floor(Date.now() / 1000);
    }
    if (isEdit) {
      result = await PostsModel.updatePost(id, {
        title,
        author,
        teaser,
        content: cleanContent,
        image,
        createdAt: createdAtNum,
      });
    } else {
      result = await PostsModel.addPost({
        title,
        author,
        teaser,
        content: cleanContent,
        image,
        createdAt: createdAtNum,
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
