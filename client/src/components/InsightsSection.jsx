import { formatCurrency } from "../lib/formatters.js";
import { BarChartIcon, CalendarIcon, TagIcon } from "./Icons.jsx";
import { getCategoryTheme } from "../lib/categoryColors.js";

const InsightsSection = ({ summary, onFilterByCategory, onFilterByMonth, hideCategoryBar = false }) => (
  <div className={hideCategoryBar ? "" : "insights-grid"}>
    {!hideCategoryBar && (
      <article className="card">
        <div className="card-header">
          <div className="card-header-content">
            <div className="card-header-icon">
              <BarChartIcon size={20} />
            </div>
            <div>
              <p className="eyebrow">BY CATEGORY</p>
              <h2>Category Spending</h2>
            </div>
          </div>
          <span className="stat-badge" style={{ fontSize: "0.7rem" }}>CLICK TO FILTER</span>
        </div>

        <div className="bars-list">
          {summary.byCategory.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px 16px", color: "var(--text-muted)" }}>
              <TagIcon size={28} />
              <p style={{ marginTop: "6px" }}>Add your first expense to see category insights.</p>
            </div>
          ) : (
            summary.byCategory.map((item) => {
              const maxAmount = summary.byCategory[0]?.totalAmount || 1;
              const width = `${Math.max((item.totalAmount / maxAmount) * 100, 8)}%`;
              const catTheme = getCategoryTheme(item.categoryName);

              return (
                <div
                  className="bar-row interactive-bar-row"
                  key={item.categoryName}
                  onClick={() => onFilterByCategory && onFilterByCategory(item.categoryId || item.categoryName)}
                  title={`Filter expenses by ${item.categoryName}`}
                >
                  <div className="bar-label">
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>{catTheme.icon}</span> {item.categoryName}
                    </span>
                    <strong>{formatCurrency(item.totalAmount)}</strong>
                  </div>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{
                        width,
                        background: `linear-gradient(90deg, ${catTheme.color}, var(--accent-indigo))`,
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </article>
    )}

    <article className="card">
      <div className="card-header">
        <div className="card-header-content">
          <div className="card-header-icon">
            <CalendarIcon size={20} />
          </div>
          <div>
            <p className="eyebrow">BY MONTH</p>
            <h2>Monthly Summary</h2>
          </div>
        </div>
        <span className="stat-badge" style={{ fontSize: "0.7rem" }}>CLICK TO FILTER</span>
      </div>

      <div className="month-grid">
        {summary.byMonth.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px 16px", color: "var(--text-muted)", gridColumn: "1 / -1" }}>
            <CalendarIcon size={28} />
            <p style={{ marginTop: "6px" }}>Monthly totals will appear as you add expenses.</p>
          </div>
        ) : (
          summary.byMonth.map((item) => (
            <div
              className="month-card interactive-month-card"
              key={item.month}
              onClick={() => onFilterByMonth && onFilterByMonth(item.month)}
              title={`Filter expenses for ${item.month}`}
            >
              <span>{item.month}</span>
              <strong>{formatCurrency(item.totalAmount)}</strong>
            </div>
          ))
        )}
      </div>
    </article>
  </div>
);

export default InsightsSection;
