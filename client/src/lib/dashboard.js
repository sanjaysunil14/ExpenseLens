export const createAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

export const buildExpenseQueryString = (filters) => {
  const query = new URLSearchParams();

  if (filters.search.trim()) {
    query.set("search", filters.search.trim());
  }

  if (filters.categoryId) {
    query.set("categoryId", filters.categoryId);
  }

  if (filters.month) {
    query.set("month", filters.month);
  }

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
};

export const getMonthOptions = (expenses, summary) => {
  const months = new Set(summary.byMonth.map((item) => item.month));

  expenses.forEach((expense) => {
    months.add(String(expense.expenseDate).slice(0, 7));
  });

  return [...months].filter(Boolean).sort().reverse();
};
