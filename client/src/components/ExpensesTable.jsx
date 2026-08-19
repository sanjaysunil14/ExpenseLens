import { useState, useMemo } from "react";
import { formatCurrency } from "../lib/formatters.js";
import { ReceiptIcon, EditIcon, TrashIcon } from "./Icons.jsx";
import { getCategoryTheme } from "../lib/categoryColors.js";
import { exportExpensesToCSV } from "../lib/exportCsv.js";
import ReceiptDrawer from "./ReceiptDrawer.jsx";

const ExpensesTable = ({
  expenses,
  onDelete,
  onEdit,
  filters,
  onClearFilter,
  onBulkDelete,
  onDuplicate,
  onOpenImport,
}) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortField, setSortField] = useState("date");
  const [sortAsc, setSortAsc] = useState(false);
  const [density, setDensity] = useState("comfortable"); // "comfortable" | "compact"
  const [drawerExpense, setDrawerExpense] = useState(null);

  const filteredTotal = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const hasActiveFilters = Boolean(filters?.search || filters?.categoryId || filters?.month);

  // Sorting logic
  const sortedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => {
      let comparison = 0;
      if (sortField === "date") {
        comparison = new Date(a.expenseDate) - new Date(b.expenseDate);
      } else if (sortField === "amount") {
        comparison = Number(a.amount) - Number(b.amount);
      } else if (sortField === "merchant") {
        comparison = (a.merchant || "").localeCompare(b.merchant || "");
      } else if (sortField === "category") {
        comparison = (a.categoryName || "").localeCompare(b.categoryName || "");
      }
      return sortAsc ? comparison : -comparison;
    });
  }, [expenses, sortField, sortAsc]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Selection handlers
  const allSelected = expenses.length > 0 && selectedIds.length === expenses.length;

  const handleToggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(expenses.map((e) => e.id));
    }
  };

  const handleToggleRow = (e, id) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleExportSelected = () => {
    const selectedExpenses = expenses.filter((e) => selectedIds.includes(e.id));
    exportExpensesToCSV(selectedExpenses, `ExpenseLens_Selected_Export.csv`);
  };

  const handleExportAll = () => {
    const dateStr = new Date().toISOString().slice(0, 10);
    exportExpensesToCSV(expenses, `ExpenseLens_Expenses_${dateStr}.csv`);
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Delete ${selectedIds.length} selected expenses?`)) {
      if (onBulkDelete) {
        onBulkDelete(selectedIds);
      } else {
        selectedIds.forEach((id) => onDelete(id));
      }
      setSelectedIds([]);
    }
  };

  const selectedTotal = useMemo(() => {
    return expenses
      .filter((e) => selectedIds.includes(e.id))
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);
  }, [expenses, selectedIds]);

  const renderSortIndicator = (field) => {
    if (sortField !== field) {
      return <span className="sort-arrow-inactive">↕</span>;
    }
    return <span className="sort-arrow-active">{sortAsc ? "▲" : "▼"}</span>;
  };

  return (
    <section className="card">
      <div className="card-header">
        <div className="card-header-content">
          <div className="card-header-icon">
            <ReceiptIcon size={20} />
          </div>
          <div>
            <p className="eyebrow">TRANSACTION HISTORY</p>
            <h2>Recorded Expenses</h2>
          </div>
        </div>

        <div className="table-header-actions">
          {/* Density Switcher */}
          <div className="density-toggle-group">
            <button
              type="button"
              className={`density-btn ${density === "comfortable" ? "active" : ""}`}
              onClick={() => setDensity("comfortable")}
              title="Comfortable card view"
            >
              Comfortable
            </button>
            <button
              type="button"
              className={`density-btn ${density === "compact" ? "active" : ""}`}
              onClick={() => setDensity("compact")}
              title="Compact high-density view"
            >
              Compact
            </button>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={onOpenImport}
            style={{ padding: "6px 12px", fontSize: "0.82rem" }}
          >
            📥 Import CSV
          </button>

          <button
            type="button"
            className="secondary-button export-csv-btn"
            onClick={handleExportAll}
            disabled={expenses.length === 0}
            title="Download formatted CSV spreadsheet"
          >
            Export CSV
          </button>
          <span className="stat-badge">{expenses.length} ENTRIES</span>
        </div>
      </div>

      {/* Active Filter Summary Bar */}
      {hasActiveFilters && (
        <div className="filter-summary-bar">
          <span className="filter-summary-text">
            Showing <strong>{expenses.length}</strong> {expenses.length === 1 ? "expense" : "expenses"} totaling{" "}
            <strong>{formatCurrency(filteredTotal)}</strong>
            {filters?.search && <> matching &ldquo;<em>{filters.search}</em>&rdquo;</>}
          </span>
          <button
            type="button"
            className="ghost-button"
            onClick={onClearFilter}
            style={{ padding: "3px 10px", fontSize: "0.78rem" }}
          >
            ✕ Clear Filter
          </button>
        </div>
      )}

      {expenses.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px 20px", color: "var(--text-muted)" }}>
          <ReceiptIcon size={36} />
          <p style={{ marginTop: "12px", fontSize: "1.05rem", fontWeight: 600 }}>No expenses match the current filter.</p>
          {hasActiveFilters && (
            <button
              type="button"
              className="primary-button"
              onClick={onClearFilter}
              style={{ marginTop: "10px", padding: "8px 18px", fontSize: "0.85rem" }}
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View with Density & Row Click for Digital Receipt */}
          <div className={`table-wrap density-${density}`}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: "40px", textAlign: "center" }}>
                    <input
                      type="checkbox"
                      className="table-checkbox"
                      checked={allSelected}
                      onChange={handleToggleSelectAll}
                      aria-label="Select all rows"
                    />
                  </th>
                  <th className="sortable-th" onClick={() => handleSort("date")}>
                    <span>Date {renderSortIndicator("date")}</span>
                  </th>
                  <th className="sortable-th" onClick={() => handleSort("merchant")}>
                    <span>Merchant {renderSortIndicator("merchant")}</span>
                  </th>
                  <th className="sortable-th" onClick={() => handleSort("category")}>
                    <span>Category {renderSortIndicator("category")}</span>
                  </th>
                  <th className="sortable-th" onClick={() => handleSort("amount")}>
                    <span>Amount {renderSortIndicator("amount")}</span>
                  </th>
                  <th>Notes</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedExpenses.map((expense) => {
                  const catTheme = getCategoryTheme(expense.categoryName);
                  const isSelected = selectedIds.includes(expense.id);

                  return (
                    <tr
                      key={expense.id}
                      className={`clickable-row ${isSelected ? "row-selected" : ""}`}
                      onClick={() => setDrawerExpense(expense)}
                      title="Click to view digital receipt & quick actions"
                    >
                      <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="table-checkbox"
                          checked={isSelected}
                          onChange={(e) => handleToggleRow(e, expense.id)}
                          aria-label={`Select expense ${expense.merchant}`}
                        />
                      </td>
                      <td className="date-cell">
                        {String(expense.expenseDate).slice(0, 10)}
                      </td>
                      <td className="merchant-cell">{expense.merchant}</td>
                      <td>
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
                      </td>
                      <td className="amount-cell">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="notes-cell">{expense.notes || "—"}</td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                          <button
                            type="button"
                            className="ghost-button"
                            onClick={() => onDuplicate && onDuplicate(expense)}
                            title="Duplicate this expense with today's date"
                          >
                            ⚡
                          </button>
                          <button
                            type="button"
                            className="ghost-button"
                            onClick={() => onEdit(expense)}
                          >
                            <EditIcon size={13} /> Edit
                          </button>
                          <button
                            type="button"
                            className="danger-button"
                            onClick={() => onDelete(expense.id)}
                          >
                            <TrashIcon size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile High-Definition Cards View */}
          <div className="expense-cards-mobile">
            {sortedExpenses.map((expense) => {
              const catTheme = getCategoryTheme(expense.categoryName);
              const isSelected = selectedIds.includes(expense.id);

              return (
                <div
                  className={`expense-card-row ${isSelected ? "row-selected" : ""}`}
                  key={expense.id}
                  onClick={() => setDrawerExpense(expense)}
                >
                  <div className="expense-card-top">
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }} onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="table-checkbox"
                        checked={isSelected}
                        onChange={(e) => handleToggleRow(e, expense.id)}
                      />
                      <span className="expense-card-merchant">
                        {expense.merchant}
                      </span>
                    </div>
                    <span className="expense-card-amount">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>

                  <div className="expense-card-meta">
                    <span className="expense-card-date">
                      {String(expense.expenseDate).slice(0, 10)}
                    </span>
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

                  {expense.notes && (
                    <div className="expense-card-notes">
                      {expense.notes}
                    </div>
                  )}

                  <div className="expense-card-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => onDuplicate && onDuplicate(expense)}
                      title="Duplicate"
                    >
                      ⚡ Repeat
                    </button>
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => onEdit(expense)}
                    >
                      <EditIcon size={14} /> Edit
                    </button>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => onDelete(expense.id)}
                    >
                      <TrashIcon size={14} /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Floating Multi-Select Action Dock (Stripe Style) */}
      {selectedIds.length > 0 && (
        <div className="bulk-action-dock">
          <div className="bulk-dock-info">
            <span className="bulk-count-badge">{selectedIds.length}</span>
            <span>selected ({formatCurrency(selectedTotal)})</span>
          </div>

          <div className="bulk-dock-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={handleExportSelected}
              style={{ padding: "6px 14px", fontSize: "0.82rem" }}
            >
              📥 Export Selected
            </button>
            <button
              type="button"
              className="danger-button"
              onClick={handleDeleteSelected}
              style={{ padding: "6px 14px", fontSize: "0.82rem" }}
            >
              <TrashIcon size={14} /> Delete
            </button>
            <button
              type="button"
              className="ghost-button"
              onClick={() => setSelectedIds([])}
              style={{ padding: "6px 10px", fontSize: "0.82rem" }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Slide-Over Digital Receipt Drawer */}
      <ReceiptDrawer
        expense={drawerExpense}
        onClose={() => setDrawerExpense(null)}
        onEdit={(exp) => {
          setDrawerExpense(null);
          onEdit(exp);
        }}
        onDelete={(id) => {
          setDrawerExpense(null);
          onDelete(id);
        }}
        onDuplicate={(exp) => {
          setDrawerExpense(null);
          onDuplicate(exp);
        }}
      />
    </section>
  );
};

export default ExpensesTable;
