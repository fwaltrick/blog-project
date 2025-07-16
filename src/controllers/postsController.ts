import type { Request, Response } from "express";
import { PostsModel } from "../models/PostsModel";

export const postDetailController = (req: Request, res: Response) => {
  const post = PostsModel.getPostBySlug(req.params.slug);

  if (post) {
    res.render("post-detail", {
      post,
      meta: {
        title: post.title,
      },
    });
  } else {
    res.status(404).render("404", {
      meta: {
        title: "Page Not Found",
      },
    });
  }
};
