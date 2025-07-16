import { Router } from "express";
import { aboutController } from "../controllers/aboutController";
import { homeController } from "../controllers/homeController";
import { contactController } from "../controllers/contactController";
import { postDetailController } from "../controllers/postsController";
import {
  adminPostsListController,
  adminPostFormController,
  adminPostSubmitController,
  adminDeletePostController,
} from "../controllers/adminController";

const router = Router();

// Public Routes
router.get("/", homeController);
router.get("/post/:slug", postDetailController);
router.get("/contact", contactController);
router.get("/about", aboutController);

// Admin Routes
router.get("/admin", adminPostsListController); // Dashboard redirects to posts list
router.get("/admin/posts", adminPostsListController);
router.get("/admin/posts/new", adminPostFormController); // Create form
router.post("/admin/posts", adminPostSubmitController); // Create submission
router.get("/admin/posts/:id/edit", adminPostFormController); // Edit form
router.patch("/admin/posts/:id", adminPostSubmitController); // Edit submission
router.delete("/admin/posts/:id", adminDeletePostController);

export default router;
