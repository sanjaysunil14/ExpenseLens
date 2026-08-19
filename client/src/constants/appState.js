export const STORAGE_KEYS = {
  authToken: "expenseLensToken",
};

export const emptyExpenseForm = {
  merchant: "",
  amount: "",
  categoryId: "",
  expenseDate: new Date().toISOString().slice(0, 10),
  notes: "",
};

export const initialAuthForm = {
  name: "",
  email: "",
  password: "",
};

export const emptySummary = {
  totalAmount: 0,
  expenseCount: 0,
  byCategory: [],
  byMonth: [],
};
