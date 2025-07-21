import type { Request, Response } from "express";
import { PostsModel } from "../models/PostsModel";

export const homeController = async (req: Request, res: Response) => {
  await PostsModel.loadPosts();
  const posts = PostsModel.getAllPosts();

  res.render("index", {
    meta: {
      title: "Clean Blog",
    },
    title: "Clean Blog",
    subtitle: "A Blog Theme by Start Bootstrap",
    image_url: "/images/home-bg.jpg",
    posts,
  });
};
