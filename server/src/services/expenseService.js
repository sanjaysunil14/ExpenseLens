import {
  createExpense as createExpenseRecord,
  deleteExpense as deleteExpenseRecord,
  findExpenseById,
  getExpenseSummary as getExpenseSummaryRecord,
  listExpensesByUser,
  updateExpense as updateExpenseRecord,
} from "../repositories/expenseRepository.js";
import { findCategoryById } from "../repositories/categoryRepository.js";
import { createHttpError } from "../utils/httpError.js";

const normalizeFilters = (filters = {}) => ({
  search: filters.search?.trim() || "",
  categoryId: filters.categoryId ? Number(filters.categoryId) : null,
  month: filters.month?.trim() || "",
});

const mapExpense = (expense) => ({
  id: Number(expense.id),
  userId: Number(expense.user_id),
  merchant: expense.merchant,
  amount: Number(expense.amount),
  notes: expense.notes || "",
  expenseDate: expense.expense_date,
  createdAt: expense.created_at,
  updatedAt: expense.updated_at,
  categoryId: expense.category_id ? Number(expense.category_id) : null,
  categoryName: expense.category_name,
});

const ensureCategoryExists = async (categoryId) => {
  const category = await findCategoryById(categoryId);

  if (!category) {
    throw createHttpError(400, "Selected category does not exist");
  }
};

export const getExpenses = async (userId, filters) => {
  const normalizedFilters = normalizeFilters(filters);
  const expenses = await listExpensesByUser(userId, normalizedFilters);
  return expenses.map(mapExpense);
};

export const createExpense = async (userId, payload) => {
  await ensureCategoryExists(payload.categoryId);

  const createdExpense = await createExpenseRecord({
    userId,
    ...payload,
  });

  if (!createdExpense) {
    throw createHttpError(500, "Expense could not be created");
  }

  const expense = await findExpenseById(createdExpense.id, userId);
  return mapExpense(expense);
};

export const updateExpense = async (id, userId, payload) => {
  await ensureCategoryExists(payload.categoryId);

  const updatedExpense = await updateExpenseRecord({
    id,
    userId,
    ...payload,
  });

  if (!updatedExpense) {
    throw createHttpError(404, "Expense not found");
  }

  const expense = await findExpenseById(id, userId);
  return mapExpense(expense);
};

export const deleteExpense = async (id, userId) => {
  const deletedExpense = await deleteExpenseRecord(id, userId);

  if (!deletedExpense) {
    throw createHttpError(404, "Expense not found");
  }
};

export const getExpenseSummary = async (userId, filters) => {
  const normalizedFilters = normalizeFilters(filters);
  const summary = await getExpenseSummaryRecord(userId, normalizedFilters);

  return {
    totalAmount: Number(summary.totals.total_amount || 0),
    expenseCount: Number(summary.totals.expense_count || 0),
    byCategory: summary.byCategory.map((item) => ({
      categoryName: item.category_name,
      totalAmount: Number(item.total_amount),
    })),
    byMonth: summary.byMonth.map((item) => ({
      month: item.month,
      totalAmount: Number(item.total_amount),
    })),
  };
};
