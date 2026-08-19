const parsePositiveAmount = (amount) => {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return null;
  }

  return Number(numericAmount.toFixed(2));
};

export const validateExpense = (body) => {
  const errors = [];
  const merchant = body?.merchant?.trim() || "";
  const notes = body?.notes?.trim() || "";
  const amount = parsePositiveAmount(body?.amount);
  const categoryId = Number(body?.categoryId);
  const expenseDate = body?.expenseDate;

  if (merchant.length < 2) {
    errors.push("Merchant or description must be at least 2 characters long");
  }

  if (amount === null) {
    errors.push("Amount must be a positive number");
  }

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    errors.push("A valid category is required");
  }

  if (!expenseDate || Number.isNaN(Date.parse(expenseDate))) {
    errors.push("A valid expense date is required");
  }

  if (notes.length > 500) {
    errors.push("Notes cannot be longer than 500 characters");
  }

  return {
    valid: errors.length === 0,
    errors,
    value: {
      merchant,
      notes,
      amount,
      categoryId,
      expenseDate,
    },
  };
};
