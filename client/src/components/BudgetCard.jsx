import { useState, useEffect } from "react";
import { formatCurrency } from "../lib/formatters.js";
import { TrendingUpIcon, EditIcon } from "./Icons.jsx";

const BudgetCard = ({ totalSpent = 0 }) => {
  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem("expenselens_budget");
    return saved ? Number(saved) : 50000;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempBudget, setTempBudget] = useState(budget);

  useEffect(() => {
    localStorage.setItem("expenselens_budget", String(budget));
  }, [budget]);

  const spentPercent = Math.min(Math.round((totalSpent / budget) * 100), 100);
  const remaining = budget - totalSpent;
  const isOverBudget = totalSpent > budget;

  // Days remaining in current month
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysRemaining = Math.max(daysInMonth - now.getDate(), 1);
  const dailyBurn = remaining > 0 ? (remaining / daysRemaining).toFixed(0) : 0;

  const handleSave = (e) => {
    e.preventDefault();
    if (Number(tempBudget) > 0) {
      setBudget(Number(tempBudget));
    }
    setIsEditing(false);
  };

  return (
    <article className="card budget-card">
      <div className="card-header" style={{ marginBottom: "16px", paddingBottom: "12px" }}>
        <div className="card-header-content">
          <div className="card-header-icon" style={{ width: "38px", height: "38px" }}>
            <TrendingUpIcon size={18} />
          </div>
          <div>
            <p className="eyebrow">MONTHLY TARGET</p>
            <h2 style={{ fontSize: "1.15rem" }}>Budget &amp; Spend Velocity</h2>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <input
              type="number"
              min="100"
              step="100"
              value={tempBudget}
              onChange={(e) => setTempBudget(e.target.value)}
              style={{ width: "110px", padding: "6px 10px", fontSize: "0.88rem" }}
              autoFocus
            />
            <button type="submit" className="primary-button" style={{ padding: "6px 12px", fontSize: "0.82rem" }}>
              Save
            </button>
          </form>
        ) : (
          <button
            type="button"
            className="ghost-button"
            onClick={() => {
              setTempBudget(budget);
              setIsEditing(true);
            }}
            style={{ padding: "6px 12px", fontSize: "0.82rem" }}
          >
            <EditIcon size={13} /> Edit Target
          </button>
        )}
      </div>

      <div className="budget-body">
        <div className="budget-metrics-row">
          <div className="budget-metric">
            <span>Spent / Target</span>
            <strong>
              {formatCurrency(totalSpent)} <span className="budget-muted">/ {formatCurrency(budget)}</span>
            </strong>
          </div>

          <div className="budget-metric" style={{ textAlign: "right" }}>
            <span>{isOverBudget ? "Over Budget By" : "Remaining Allowance"}</span>
            <strong style={{ color: isOverBudget ? "var(--error)" : "var(--success)" }}>
              {isOverBudget ? `+${formatCurrency(Math.abs(remaining))}` : formatCurrency(remaining)}
            </strong>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="budget-progress-track">
          <div
            className={`budget-progress-fill ${isOverBudget ? "over" : spentPercent > 80 ? "warning" : "good"}`}
            style={{ width: `${spentPercent}%` }}
          />
        </div>

        <div className="budget-footer-row">
          <span className="budget-burn-tag">
            {spentPercent}% of monthly limit used
          </span>
          <span className="budget-daily-allowance">
            {remaining > 0 ? (
              <>💡 <strong>{formatCurrency(dailyBurn)}/day</strong> remaining for {daysRemaining} days</>
            ) : (
              <span style={{ color: "var(--error)", fontWeight: 700 }}>⚠️ Monthly target exceeded</span>
            )}
          </span>
        </div>
      </div>
    </article>
  );
};

export default BudgetCard;
