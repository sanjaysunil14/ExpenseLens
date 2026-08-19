import { PlusIcon, EditIcon } from "./Icons.jsx";
import { CATEGORY_PALETTES } from "../lib/categoryColors.js";

const PRESET_CHIPS = [
  { label: "Food & Dining", icon: "🍔", search: "food" },
  { label: "Travel & Transit", icon: "🚗", search: "travel" },
  { label: "Bills & Utilities", icon: "⚡", search: "bill" },
  { label: "Tech & Work", icon: "💻", search: "tech" },
  { label: "Shopping", icon: "🛍️", search: "shop" },
  { label: "Entertainment", icon: "🎬", search: "entertain" },
];

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
}) => {
  const handleChipClick = (chip) => {
    const matchedCategory = categories.find((c) =>
      c.name.toLowerCase().includes(chip.search)
    );
    if (matchedCategory) {
      onChange("categoryId", matchedCategory.id);
    }
  };

  return (
    <article className="card glow-card">
      <div className="card-header">
        <div className="card-header-content">
          <div className="card-header-icon">
            {editingExpenseId ? <EditIcon size={20} /> : <PlusIcon size={20} />}
          </div>
          <div>
            <p className="eyebrow">TRANSACTION ENTRY</p>
            <h2>{editingExpenseId ? "Edit Expense" : "Add Expense"}</h2>
          </div>
        </div>
        {editingExpenseId && (
          <button type="button" className="ghost-button" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>

      {/* Preset Category Chips */}
      {!editingExpenseId && (
        <div className="preset-chips-row">
          <span className="preset-chips-label">Quick select:</span>
          <div className="preset-chips-list">
            {PRESET_CHIPS.map((chip) => (
              <button
                key={chip.label}
                type="button"
                className="preset-chip-btn"
                onClick={() => handleChipClick(chip)}
              >
                <span>{chip.icon}</span> {chip.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <form className="stack-form" onSubmit={onSubmit} style={{ marginTop: "12px" }}>
        <label>
          <span>Merchant or Description</span>
          <input
            value={expenseForm.merchant}
            onChange={(e) => onChange("merchant", e.target.value)}
            placeholder="e.g. AWS Cloud, Whole Foods, Uber"
            required
          />
        </label>

        <div className="split-fields">
          <label>
            <span>Amount (INR)</span>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={expenseForm.amount}
              onChange={(e) => onChange("amount", e.target.value)}
              placeholder="0.00"
              required
            />
          </label>

          <label>
            <span>Date</span>
            <input
              type="date"
              value={expenseForm.expenseDate}
              onChange={(e) => onChange("expenseDate", e.target.value)}
              required
            />
          </label>
        </div>

        <label>
          <span>Category</span>
          <select
            value={expenseForm.categoryId}
            onChange={(e) => onChange("categoryId", e.target.value)}
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
            rows="3"
            value={expenseForm.notes}
            onChange={(e) => onChange("notes", e.target.value)}
            placeholder="Optional notes or invoice details..."
          />
        </label>

        {errorMessage && <p className="status error">{errorMessage}</p>}
        {feedback && <p className="status success">{feedback}</p>}

        <button className="primary-button" type="submit" disabled={submittingExpense} style={{ marginTop: "4px" }}>
          {submittingExpense
            ? "Saving..."
            : editingExpenseId
              ? "Update Expense"
              : "Add Expense"}
        </button>
      </form>
    </article>
  );
};

export default ExpenseFormCard;
