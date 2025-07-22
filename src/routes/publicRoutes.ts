import { Router } from "express";
import { aboutController } from "../controllers/aboutController";
import { homeController } from "../controllers/homeController";
import { contactController } from "../controllers/contactController";
import { postDetailController } from "../controllers/postsController";

const router = Router();

// Public Routes
router.get("/", homeController);

router.get("/about", aboutController);
router.get("/contact", contactController);

router.get("/:slug", postDetailController);

export default router;
