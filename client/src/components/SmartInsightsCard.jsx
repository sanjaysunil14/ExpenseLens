import { useMemo } from "react";
import { formatCurrency } from "../lib/formatters.js";
import { getCategoryTheme } from "../lib/categoryColors.js";
import { LightbulbIcon, SparklesIcon, CalendarIcon, TagIcon } from "./Icons.jsx";

const SmartInsightsCard = ({ expenses = [], summary }) => {
  const insights = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];

    const list = [];

    // 1. Largest Single Transaction
    const highest = expenses.reduce((max, e) => (Number(e.amount) > Number(max.amount) ? e : max), expenses[0]);
    if (highest && Number(highest.amount) > 0) {
      list.push({
        id: "largest",
        icon: <SparklesIcon size={18} />,
        title: "Largest Single Transaction",
        desc: `${highest.merchant} accounted for ${formatCurrency(highest.amount)} on ${String(highest.expenseDate).slice(0, 10)}.`,
        tag: "TOP OUTFLOW",
      });
    }

    // 2. Weekend vs Weekday ratio
    let weekendTotal = 0;
    let weekdayTotal = 0;
    expenses.forEach((e) => {
      const day = new Date(e.expenseDate).getDay();
      if (day === 0 || day === 6) {
        weekendTotal += Number(e.amount);
      } else {
        weekdayTotal += Number(e.amount);
      }
    });

    const total = weekendTotal + weekdayTotal || 1;
    const weekendPct = Math.round((weekendTotal / total) * 100);
    if (weekendPct > 30) {
      list.push({
        id: "weekend",
        icon: <CalendarIcon size={18} />,
        title: "Weekend Spending Concentration",
        desc: `Weekend transactions account for ${weekendPct}% (${formatCurrency(weekendTotal)}) of total monthly spend.`,
        tag: "PATTERNS",
      });
    }

    // 3. Top category share
    if (summary?.byCategory?.length > 0) {
      const topCat = summary.byCategory[0];
      const catTotal = summary.totalAmount || 1;
      const catPct = Math.round((topCat.totalAmount / catTotal) * 100);
      const theme = getCategoryTheme(topCat.categoryName);

      list.push({
        id: "category_dominance",
        icon: <TagIcon size={18} />,
        title: `Primary Outflow: ${topCat.categoryName}`,
        desc: `Represents ${catPct}% of overall expenditure (${formatCurrency(topCat.totalAmount)}).`,
        tag: "ALLOCATION",
      });
    }

    return list;
  }, [expenses, summary]);

  if (insights.length === 0) return null;

  return (
    <article className="card smart-insights-card">
      <div className="card-header" style={{ marginBottom: "14px", paddingBottom: "10px" }}>
        <div className="card-header-content">
          <div className="card-header-icon" style={{ width: "36px", height: "36px" }}>
            <LightbulbIcon size={18} />
          </div>
          <div>
            <p className="eyebrow">AUTOMATED TELEMETRY</p>
            <h2 style={{ fontSize: "1.15rem" }}>Smart Financial Insights</h2>
          </div>
        </div>
        <span className="stat-badge">AI ANALYSIS</span>
      </div>

      <div className="smart-insights-grid">
        {insights.map((item) => (
          <div className="smart-insight-item" key={item.id}>
            <div className="smart-insight-icon">{item.icon}</div>
            <div className="smart-insight-text">
              <div className="smart-insight-header">
                <strong>{item.title}</strong>
                <span className="smart-insight-tag">{item.tag}</span>
              </div>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
};

export default SmartInsightsCard;
