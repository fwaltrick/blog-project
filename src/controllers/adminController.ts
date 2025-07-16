import type { Request, Response } from "express";
import { PostsModel } from "../models/PostsModel";

// Admin Dashboard - Show posts list
export const adminDashboardController = (req: Request, res: Response) => {
  const posts = PostsModel.getAllPosts();

  res.render("admin/posts-list", {
    meta: {
      title: "Admin - Manage Posts",
    },
    posts,
  });
};

// List all posts for admin
export const adminPostsListController = (req: Request, res: Response) => {
  const posts = PostsModel.getAllPosts();

  res.render("admin/posts-list", {
    meta: {
      title: "Manage Posts",
    },
    posts,
  });
};

// Show create post form
export const adminCreatePostController = (req: Request, res: Response) => {
  res.render("admin/post-form", {
    meta: {
      title: "Create New Post",
    },
    isEdit: false,
  });
};

// Show edit post form
export const adminEditPostController = (req: Request, res: Response) => {
  const id = req.params.id;
  const post = PostsModel.getPostById(id);

  if (!post) {
    return res.status(404).render("404", {
      meta: {
        title: "Post Not Found",
      },
    });
  }

  res.render("admin/post-form", {
    meta: {
      title: `Edit: ${post.title}`,
    },
    post,
    id,
    isEdit: true,
  });
};

// Handle create post submission
export const adminCreatePostSubmitController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { title, author, teaser, content, image } = req.body;

    const newPost = PostsModel.addPost({
      title,
      author,
      teaser,
      content,
      image,
      createdAt: Math.floor(Date.now() / 1000), // Current timestamp
    });

    // Check if request expects JSON (AJAX request)
    if (req.headers.accept?.includes("application/json")) {
      return res
        .status(201)
        .contentType("application/json")
        .json({ success: true, post: newPost });
    }

    // Redirect to posts list with success message (form submission)
    res.redirect("/admin/posts?success=created");
  } catch (error) {
    console.error("Error creating post:", error);

    // Check if request expects JSON (AJAX request)
    if (req.headers.accept?.includes("application/json")) {
      return res
        .status(500)
        .contentType("application/json")
        .json({ success: false, error: "Creation failed" });
    }

    res.redirect("/admin/posts/new?error=creation_failed");
  }
};

// Handle edit post submission
export const adminEditPostSubmitController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = req.params.id;
    const { title, author, teaser, content, image } = req.body;

    const updatedPost = PostsModel.updatePost(id, {
      title,
      author,
      teaser,
      content,
      image,
      createdAt: Math.floor(Date.now() / 1000),
    });

    if (!updatedPost) {
      // Check if request expects JSON (AJAX request)
      if (req.headers.accept?.includes("application/json")) {
        return res
          .status(404)
          .contentType("application/json")
          .json({ success: false, error: "Post not found" });
      }
      return res.status(404).redirect("/admin/posts?error=post_not_found");
    }

    // Check if request expects JSON (AJAX request)
    if (req.headers.accept?.includes("application/json")) {
      return res
        .status(200)
        .contentType("application/json")
        .json({ success: true, post: updatedPost });
    }

    res.redirect("/admin/posts?success=updated");
  } catch (error) {
    console.error("Error updating post:", error);

    // Check if request expects JSON (AJAX request)
    if (req.headers.accept?.includes("application/json")) {
      return res
        .status(500)
        .contentType("application/json")
        .json({ success: false, error: "Update failed" });
    }

    res.redirect(`/admin/posts/${req.params.id}/edit?error=update_failed`);
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
      // Check if request expects JSON (AJAX request)
      if (req.headers.accept?.includes("application/json")) {
        return res
          .status(404)
          .contentType("application/json")
          .json({ success: false, error: "Post not found" });
      }
      return res.status(404).redirect("/admin/posts?error=post_not_found");
    }

    // Check if request expects JSON (AJAX request)
    if (req.headers.accept?.includes("application/json")) {
      return res
        .status(200)
        .contentType("application/json")
        .json({ success: true, message: "Post deleted successfully" });
    }

    res.redirect("/admin/posts?success=deleted");
  } catch (error) {
    console.error("Error deleting post:", error);

    // Check if request expects JSON (AJAX request)
    if (req.headers.accept?.includes("application/json")) {
      return res
        .status(500)
        .contentType("application/json")
        .json({ success: false, error: "Deletion failed" });
    }

    res.redirect("/admin/posts?error=deletion_failed");
  }
};
