import { useEffect, useRef } from "react";
import { PlusIcon } from "./Icons.jsx";

const QuickAddModal = ({
  isOpen,
  onClose,
  categories = [],
  onSubmit,
  submitting,
}) => {
  const merchantInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        merchantInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      merchant: formData.get("merchant"),
      amount: formData.get("amount"),
      categoryId: formData.get("categoryId"),
      expenseDate: formData.get("expenseDate") || new Date().toISOString().slice(0, 10),
      notes: formData.get("notes") || "",
    };
    onSubmit(payload);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="card-header-icon" style={{ width: "36px", height: "36px" }}>
              <PlusIcon size={18} />
            </div>
            <div>
              <p className="eyebrow" style={{ margin: 0 }}>QUICK ENTRY</p>
              <h3 style={{ margin: 0, fontSize: "1.15rem", color: "var(--text-heading)" }}>Log Expense</h3>
            </div>
          </div>
          <button type="button" className="ghost-button" onClick={onClose} style={{ padding: "4px 8px" }}>
            ✕
          </button>
        </div>

        <form className="stack-form" onSubmit={handleSubmit}>
          <label>
            <span>Merchant or Description</span>
            <input
              ref={merchantInputRef}
              name="merchant"
              placeholder="e.g. Starbucks, Uber, AWS, Supermarket"
              required
            />
          </label>

          <div className="split-fields">
            <label>
              <span>Amount (INR)</span>
              <input
                type="number"
                name="amount"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                required
              />
            </label>

            <label>
              <span>Date</span>
              <input
                type="date"
                name="expenseDate"
                defaultValue={new Date().toISOString().slice(0, 10)}
                required
              />
            </label>
          </div>

          <label>
            <span>Category</span>
            <select name="categoryId" required defaultValue="">
              <option value="" disabled>Select category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Notes (Optional)</span>
            <input
              name="notes"
              placeholder="Quick tags or receipt note..."
            />
          </label>

          <div className="button-row" style={{ marginTop: "10px" }}>
            <button className="primary-button" type="submit" disabled={submitting} style={{ flex: 1 }}>
              {submitting ? "Saving..." : "Add Expense"}
            </button>
            <button className="secondary-button" type="button" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickAddModal;
