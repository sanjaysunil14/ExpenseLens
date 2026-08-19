import {
  createExpense,
  deleteExpense,
  getExpenseSummary,
  getExpenses,
  updateExpense,
} from "../services/expenseService.js";

export const listUserExpenses = async (req, res, next) => {
  try {
    const expenses = await getExpenses(req.user.id, req.query);

    res.json({
      success: true,
      expenses,
    });
  } catch (error) {
    next(error);
  }
};

export const createUserExpense = async (req, res, next) => {
  try {
    const expense = await createExpense(req.user.id, req.validatedBody);

    res.status(201).json({
      success: true,
      expense,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserExpense = async (req, res, next) => {
  try {
    const expense = await updateExpense(
      Number(req.params.id),
      req.user.id,
      req.validatedBody,
    );

    res.json({
      success: true,
      expense,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserExpense = async (req, res, next) => {
  try {
    await deleteExpense(Number(req.params.id), req.user.id);

    res.json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getUserExpenseSummary = async (req, res, next) => {
  try {
    const summary = await getExpenseSummary(req.user.id, req.query);

    res.json({
      success: true,
      summary,
    });
  } catch (error) {
    next(error);
  }
};
