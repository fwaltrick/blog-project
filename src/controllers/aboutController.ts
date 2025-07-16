import type { Request, Response } from "express";

export const aboutController = (req: Request, res: Response) => {
  res.render("about", {
    meta: {
      title: "About Me",
    },
    title: "About Me",
    subtitle: "This is what I do.",
    image_url: "/images/about-bg.jpg",
  });
};
