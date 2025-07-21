import { Router } from "express";
import publicRoutes from "./publicRoutes";
import adminRoutes from "./adminRoutes";

const router = Router();

// Use admin routes
router.use("/admin", adminRoutes);

// Use public routes
router.use("/", publicRoutes);

export const routes = router;
export default router;
