import express from "express";
import * as blogController from "../controllers/blog.controller.js";
import { authenticateAdmin } from "../middleware/auth.middleware.js";
import { checkPermission } from "../middleware/permission.middleware.js";

const router = express.Router();

// Public routes
router.get("/", blogController.getBlogs);
router.get("/:slug", blogController.getBlogBySlug);

// Admin routes
router.post(
  "/",
  authenticateAdmin,
  checkPermission("blogs.create"),
  blogController.createBlog
);
router.put(
  "/:id",
  authenticateAdmin,
  checkPermission("blogs.update"),
  blogController.updateBlog
);
router.delete(
  "/:id",
  authenticateAdmin,
  checkPermission("blogs.delete"),
  blogController.deleteBlog
);

export default router;

