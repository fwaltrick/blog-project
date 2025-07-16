import type { Request, Response } from "express";

export const contactController = (req: Request, res: Response) => {
  res.render("contact", {
    meta: {
      title: "Contact Me",
    },
    title: "Contact Me",
    subtitle: "Have questions? I have answers.",
    image_url: "/images/contact-bg.jpg",
  });
};
