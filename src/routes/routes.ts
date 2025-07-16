import { Router } from "express";
import { aboutController } from "../controllers/aboutController";
import { homeController } from "../controllers/homeController";
import { contactController } from "../controllers/contactController";
import { postDetailController } from "../controllers/postsController";
import {
  adminDashboardController,
  adminPostsListController,
  adminCreatePostController,
  adminEditPostController,
  adminCreatePostSubmitController,
  adminEditPostSubmitController,
  adminDeletePostController,
} from "../controllers/adminController";

const router = Router();

// Public Routes
router.get("/", homeController);
router.get("/post/:slug", postDetailController);
router.get("/contact", contactController);
router.get("/about", aboutController);

// Admin Routes
router.get("/admin", adminDashboardController);
router.get("/admin/posts", adminPostsListController);
router.get("/admin/posts/new", adminCreatePostController);
router.post("/admin/posts", adminCreatePostSubmitController);
router.get("/admin/posts/:id/edit", adminEditPostController);
router.patch("/admin/posts/:id", adminEditPostSubmitController);
router.delete("/admin/posts/:id", adminDeletePostController);

export default router;
