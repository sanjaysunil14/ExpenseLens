import express from "express";
import { login, register } from "../controllers/authController.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import {
  validateLogin,
  validateRegistration,
} from "../validators/authValidator.js";

const router = express.Router();

router.post("/register", validateRequest(validateRegistration), register);
router.post("/login", validateRequest(validateLogin), login);

export default router;
