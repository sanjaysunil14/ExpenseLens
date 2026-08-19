import express from "express";
import {
  getApiStatus,
  getDatabaseStatus,
} from "../controllers/healthController.js";

const router = express.Router();

router.get("/", getApiStatus);
router.get("/db-check", getDatabaseStatus);

export default router;
