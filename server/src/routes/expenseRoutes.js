import express from "express";
import {
  createUserExpense,
  deleteUserExpense,
  getUserExpenseSummary,
  listUserExpenses,
  updateUserExpense,
} from "../controllers/expenseController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import { validateExpense } from "../validators/expenseValidator.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", listUserExpenses);
router.get("/summary", getUserExpenseSummary);
router.post("/", validateRequest(validateExpense), createUserExpense);
router.put("/:id", validateRequest(validateExpense), updateUserExpense);
router.delete("/:id", deleteUserExpense);

export default router;
