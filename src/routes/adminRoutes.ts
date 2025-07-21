import { Router } from "express";
import {
  adminPostsListController,
  adminPostFormController,
  adminPostSubmitController,
  adminDeletePostController,
} from "../controllers/adminController";

const router = Router();

// Admin Routes
router.get("/", adminPostsListController); // Dashboard
router.get("/posts", adminPostsListController);
router.get("/posts/new", adminPostFormController); // Create form
router.post("/posts", adminPostSubmitController); // Create submission
router.get("/posts/:id/edit", adminPostFormController); // Edit form
router.patch("/posts/:id", adminPostSubmitController); // Edit submission
router.delete("/posts/:id", adminDeletePostController);

export default router;
