import { formatCurrency } from "../lib/formatters.js";

const VerdictBar = ({ summary, expenses }) => {
  const budget = (() => {
    const saved = localStorage.getItem("expenselens_budget");
    return saved ? Number(saved) : 50000;
  })();

  const totalSpent = summary?.totalAmount || 0;
  const spentPct = budget > 0 ? (totalSpent / budget) * 100 : 0;
  const remaining = budget - totalSpent;

  // Days calculations
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dayOfMonth = now.getDate();
  const daysRemaining = Math.max(daysInMonth - dayOfMonth, 1);
  const expectedPacePct = (dayOfMonth / daysInMonth) * 100;

  let statusType = "good"; // good | caution | alert
  let headline = "";
  let message = "";

  if (totalSpent > budget) {
    statusType = "alert";
    headline = "Budget Exceeded";
    message = `You are ${formatCurrency(Math.abs(remaining))} over your monthly limit. Review recent large entries to restore balance.`;
  } else if (spentPct > expectedPacePct + 15) {
    statusType = "caution";
    headline = "Pacing Faster Than Usual";
    message = `You have used ${spentPct.toFixed(0)}% of your budget with ${daysRemaining} days left. Suggested limit: ${formatCurrency(remaining / daysRemaining)}/day.`;
  } else {
    statusType = "good";
    headline = "Financial Health On Track";
    message = `Spending is well-balanced (${spentPct.toFixed(0)}% of limit). You have ${formatCurrency(remaining / daysRemaining)}/day available for the rest of the month.`;
  }

  return (
    <div className={`verdict-bar verdict-${statusType}`}>
      <div className="verdict-status-indicator">
        <span className="verdict-dot" />
        <span className="verdict-badge">{statusType.toUpperCase()}</span>
      </div>

      <div className="verdict-content">
        <strong className="verdict-headline">{headline}</strong>
        <span className="verdict-message">{message}</span>
      </div>

      <div className="verdict-quick-stats">
        <div className="verdict-stat-pill">
          <span>Remaining</span>
          <strong>{formatCurrency(Math.max(remaining, 0))}</strong>
        </div>
      </div>
    </div>
  );
};

export default VerdictBar;
