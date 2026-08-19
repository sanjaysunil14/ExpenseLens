import express from "express";
import { listAllCategories } from "../controllers/categoryController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, listAllCategories);

export default router;
