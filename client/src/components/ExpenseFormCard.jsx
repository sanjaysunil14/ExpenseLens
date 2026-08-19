const ExpenseFormCard = ({
  categories,
  editingExpenseId,
  errorMessage,
  expenseForm,
  feedback,
  onCancelEdit,
  onChange,
  onSubmit,
  submittingExpense,
}) => (
  <article className="card">
    <div className="card-header">
      <div>
        <p className="eyebrow">Expense form</p>
        <h2>{editingExpenseId ? "Edit expense" : "Add new expense"}</h2>
      </div>
      {editingExpenseId && (
        <button type="button" className="ghost-button" onClick={onCancelEdit}>
          Cancel edit
        </button>
      )}
    </div>

    <form className="stack-form" onSubmit={onSubmit}>
      <label>
        <span>Merchant or description</span>
        <input
          value={expenseForm.merchant}
          onChange={(event) => onChange("merchant", event.target.value)}
          placeholder="Groceries, Uber, Coffee"
          required
        />
      </label>

      <div className="split-fields">
        <label>
          <span>Amount</span>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={expenseForm.amount}
            onChange={(event) => onChange("amount", event.target.value)}
            required
          />
        </label>

        <label>
          <span>Date</span>
          <input
            type="date"
            value={expenseForm.expenseDate}
            onChange={(event) => onChange("expenseDate", event.target.value)}
            required
          />
        </label>
      </div>

      <label>
        <span>Category</span>
        <select
          value={expenseForm.categoryId}
          onChange={(event) => onChange("categoryId", event.target.value)}
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Notes</span>
        <textarea
          rows="4"
          value={expenseForm.notes}
          onChange={(event) => onChange("notes", event.target.value)}
          placeholder="Optional extra context"
        />
      </label>

      {errorMessage && <p className="status error">{errorMessage}</p>}
      {feedback && <p className="status success">{feedback}</p>}

      <button className="primary-button" type="submit" disabled={submittingExpense}>
        {submittingExpense
          ? "Saving..."
          : editingExpenseId
            ? "Update expense"
            : "Add expense"}
      </button>
    </form>
  </article>
);

export default ExpenseFormCard;
