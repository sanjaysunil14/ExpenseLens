import { useEffect } from "react";
import { formatCurrency } from "../lib/formatters.js";
import { EditIcon, TrashIcon, ZapIcon, PrinterIcon, CheckIcon } from "./Icons.jsx";
import { getCategoryTheme } from "../lib/categoryColors.js";

const ReceiptDrawer = ({
  expense,
  onClose,
  onEdit,
  onDelete,
  onDuplicate,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!expense) return null;

  const catTheme = getCategoryTheme(expense.categoryName);
  const formattedDate = new Date(expense.expenseDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-header-title">
            <span className="eyebrow" style={{ margin: 0 }}>TRANSACTION RECEIPT</span>
            <h3 style={{ margin: 0, fontSize: "1.1rem" }}>#{expense.id.slice(0, 8)}</h3>
          </div>
          <button type="button" className="ghost-button" onClick={onClose} style={{ padding: "4px 8px" }}>
            ✕
          </button>
        </div>

        {/* Digital Receipt View */}
        <div className="receipt-paper">
          <div className="receipt-top-notch" />
          
          <div className="receipt-brand">
            <span className="receipt-logo">EXPENSELENS</span>
            <span className="receipt-verified">
              <CheckIcon size={12} /> VERIFIED RECORD
            </span>
          </div>

          <div className="receipt-amount-box">
            <span className="receipt-amount-label">AMOUNT PAID</span>
            <div className="receipt-amount-val">{formatCurrency(expense.amount)}</div>
          </div>

          <div className="receipt-details-list">
            <div className="receipt-row">
              <span className="receipt-label">Merchant</span>
              <strong className="receipt-val">{expense.merchant}</strong>
            </div>

            <div className="receipt-row">
              <span className="receipt-label">Category</span>
              <span
                className="category-badge"
                style={{
                  background: catTheme.bg,
                  borderColor: catTheme.border,
                  color: catTheme.text,
                }}
              >
                <span>{catTheme.icon}</span> {expense.categoryName}
              </span>
            </div>

            <div className="receipt-row">
              <span className="receipt-label">Date</span>
              <span className="receipt-val">{formattedDate}</span>
            </div>

            <div className="receipt-row">
              <span className="receipt-label">Notes</span>
              <span className="receipt-val">{expense.notes || "No notes recorded"}</span>
            </div>

            <div className="receipt-row">
              <span className="receipt-label">Transaction ID</span>
              <span className="receipt-val" style={{ fontFamily: "monospace", fontSize: "0.75rem" }}>
                {expense.id}
              </span>
            </div>
          </div>

          <div className="receipt-barcode" />
          <div className="receipt-bottom-notch" />
        </div>

        {/* Action Buttons with Vector Icons */}
        <div className="drawer-actions">
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              onClose();
              onDuplicate(expense);
            }}
            style={{ flex: 1 }}
          >
            <ZapIcon size={15} /> Duplicate
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              onClose();
              onEdit(expense);
            }}
          >
            <EditIcon size={14} /> Edit
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={handlePrint}
            title="Print or save PDF receipt"
          >
            <PrinterIcon size={14} /> Print
          </button>

          <button
            type="button"
            className="danger-button"
            onClick={() => {
              onClose();
              onDelete(expense.id);
            }}
          >
            <TrashIcon size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptDrawer;
