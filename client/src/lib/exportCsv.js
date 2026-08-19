// CSV Export utility

export const exportExpensesToCSV = (expenses = [], filename = "ExpenseLens_Statement.csv") => {
  if (!expenses || expenses.length === 0) {
    alert("No expenses to export.");
    return;
  }

  const headers = ["ID", "Date", "Merchant / Description", "Category", "Amount (INR)", "Notes"];

  const rows = expenses.map((expense) => {
    const date = String(expense.expenseDate || "").slice(0, 10);
    const merchant = `"${(expense.merchant || "").replace(/"/g, '""')}"`;
    const category = `"${(expense.categoryName || "Uncategorized").replace(/"/g, '""')}"`;
    const amount = Number(expense.amount || 0).toFixed(2);
    const notes = `"${(expense.notes || "").replace(/"/g, '""')}"`;

    return [expense.id, date, merchant, category, amount, notes].join(",");
  });

  const csvContent = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
