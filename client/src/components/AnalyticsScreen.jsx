import { useMemo } from "react";
import { formatCurrency } from "../lib/formatters.js";
import { WalletIcon, ReceiptIcon, BarChartIcon, TagIcon, TrophyIcon, CalendarIcon, PrinterIcon, DownloadIcon } from "./Icons.jsx";
import { getCategoryTheme } from "../lib/categoryColors.js";
import { exportExpensesToCSV } from "../lib/exportCsv.js";
import CountUp from "./CountUp.jsx";

const AnalyticsScreen = ({ summary, expenses }) => {
  const avgExpense =
    summary.expenseCount > 0
      ? summary.totalAmount / summary.expenseCount
      : 0;

  const highestExpense = useMemo(() => {
    if (expenses.length === 0) return 0;
    return Math.max(...expenses.map((e) => Number(e.amount)));
  }, [expenses]);

  const topMerchants = useMemo(() => {
    const merchantMap = {};
    expenses.forEach((expense) => {
      const name = expense.merchant;
      if (!merchantMap[name]) {
        merchantMap[name] = { name, total: 0, count: 0 };
      }
      merchantMap[name].total += Number(expense.amount);
      merchantMap[name].count += 1;
    });
    return Object.values(merchantMap)
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, [expenses]);

  const maxMonthAmount = useMemo(() => {
    if (summary.byMonth.length === 0) return 1;
    return Math.max(...summary.byMonth.map((m) => Number(m.totalAmount)));
  }, [summary.byMonth]);

  const categoryTotal = useMemo(() => {
    return summary.byCategory.reduce((sum, c) => sum + Number(c.totalAmount), 0) || 1;
  }, [summary.byCategory]);

  const formatMonthLabel = (monthStr) => {
    const [year, month] = monthStr.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[parseInt(month, 10) - 1]} '${year.slice(2)}`;
  };

  const handleExport = () => {
    const dateStr = new Date().toISOString().slice(0, 10);
    exportExpensesToCSV(expenses, `ExpenseLens_Analytics_Report_${dateStr}.csv`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="page-shell analytics-shell">
      <div className="card-header" style={{ borderBottom: "none", marginBottom: 0, paddingBottom: 0 }}>
        <div className="analytics-header">
          <p className="eyebrow">ANALYTICS</p>
          <h1>Spending Insights &amp; Breakdown</h1>
          <p>Analyze where your money is spent across categories, months, and merchants.</p>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button
            type="button"
            className="secondary-button"
            onClick={handlePrint}
            title="Generate executive printable PDF statement"
          >
            <PrinterIcon size={15} /> Print Statement
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={handleExport}
            disabled={expenses.length === 0}
            title="Download complete transaction spreadsheet"
          >
            <DownloadIcon size={15} /> Download CSV
          </button>
        </div>
      </div>

      {/* 4 Clean Metric Cards with CountUp */}
      <section className="analytics-stats">
        <article className="card stat-card glow-card">
          <div className="stat-card-top">
            <span className="stat-badge">TOTAL SPENT</span>
            <div className="stat-icon-wrap">
              <WalletIcon size={22} />
            </div>
          </div>
          <div>
            <span className="stat-label">Total Outflow</span>
            <div className="stat-value">
              <CountUp end={summary.totalAmount} />
            </div>
          </div>
          <div className="stat-accent-strip" />
        </article>

        <article className="card stat-card">
          <div className="stat-card-top">
            <span className="stat-badge" style={{ background: "rgba(245, 158, 11, 0.12)", color: "var(--accent-amber)", borderColor: "rgba(245, 158, 11, 0.3)" }}>
              TRANSACTIONS
            </span>
            <div className="stat-icon-wrap" style={{ boxShadow: "0 0 16px rgba(245, 158, 11, 0.25)" }}>
              <ReceiptIcon size={22} />
            </div>
          </div>
          <div>
            <span className="stat-label">Total Transactions</span>
            <div className="stat-value">
              <CountUp end={summary.expenseCount} isCurrency={false} /> entries
            </div>
          </div>
          <div className="stat-accent-strip amber" />
        </article>

        <article className="card stat-card">
          <div className="stat-card-top">
            <span className="stat-badge" style={{ background: "rgba(16, 185, 129, 0.12)", color: "var(--accent-mint)", borderColor: "rgba(16, 185, 129, 0.3)" }}>
              AVERAGE
            </span>
            <div className="stat-icon-wrap" style={{ boxShadow: "0 0 16px rgba(16, 185, 129, 0.25)" }}>
              <BarChartIcon size={22} />
            </div>
          </div>
          <div>
            <span className="stat-label">Avg. per Expense</span>
            <div className="stat-value">
              <CountUp end={avgExpense} />
            </div>
          </div>
          <div className="stat-accent-strip mint" />
        </article>

        <article className="card stat-card">
          <div className="stat-card-top">
            <span className="stat-badge" style={{ background: "rgba(168, 85, 247, 0.12)", color: "var(--accent-purple)", borderColor: "rgba(168, 85, 247, 0.3)" }}>
              MAX SPENT
            </span>
            <div className="stat-icon-wrap" style={{ boxShadow: "0 0 16px rgba(168, 85, 247, 0.25)" }}>
              <TagIcon size={22} />
            </div>
          </div>
          <div>
            <span className="stat-label">Highest Single Expense</span>
            <div className="stat-value">
              <CountUp end={highestExpense} />
            </div>
          </div>
          <div className="stat-accent-strip" style={{ background: "linear-gradient(90deg, var(--accent-purple), var(--accent-pink))" }} />
        </article>
      </section>

      {/* Category Breakdown & Monthly Histogram */}
      <section className="insights-grid">
        <article className="card">
          <div className="card-header">
            <div className="card-header-content">
              <div className="card-header-icon">
                <TagIcon size={20} />
              </div>
              <div>
                <p className="eyebrow">BY CATEGORY</p>
                <h2>Category Breakdown</h2>
              </div>
            </div>
          </div>

          <div className="bars-list">
            {summary.byCategory.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
                <BarChartIcon size={36} />
                <p style={{ marginTop: "10px" }}>Add expenses to see category breakdowns.</p>
              </div>
            ) : (
              summary.byCategory.map((item) => {
                const maxAmount = summary.byCategory[0]?.totalAmount || 1;
                const width = `${Math.max((item.totalAmount / maxAmount) * 100, 8)}%`;
                const percentage = ((item.totalAmount / categoryTotal) * 100).toFixed(1);
                const catTheme = getCategoryTheme(item.categoryName);

                return (
                  <div className="bar-row" key={item.categoryName}>
                    <div className="bar-label">
                      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>{catTheme.icon}</span> {item.categoryName}{" "}
                        <span style={{ color: catTheme.text, fontWeight: 700 }}>({percentage}%)</span>
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

        <article className="card">
          <div className="card-header">
            <div className="card-header-content">
              <div className="card-header-icon">
                <BarChartIcon size={20} />
              </div>
              <div>
                <p className="eyebrow">BY MONTH</p>
                <h2>Monthly Spending Trend</h2>
              </div>
            </div>
          </div>

          {summary.byMonth.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
              <CalendarIcon size={36} />
              <p style={{ marginTop: "10px" }}>Monthly trends will appear as you record expenses.</p>
            </div>
          ) : (
            <div className="vertical-bars">
              {summary.byMonth.map((item) => {
                const height = `${Math.max((item.totalAmount / maxMonthAmount) * 100, 6)}%`;
                return (
                  <div className="vertical-bar-col" key={item.month}>
                    <span className="vertical-bar-amount">{formatCurrency(item.totalAmount)}</span>
                    <div className="vertical-bar" style={{ height }} />
                    <span className="vertical-bar-label">{formatMonthLabel(item.month)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </article>
      </section>

      {/* Top Merchants List */}
      <article className="card">
        <div className="card-header">
          <div className="card-header-content">
            <div className="card-header-icon">
              <TrophyIcon size={20} />
            </div>
            <div>
              <p className="eyebrow">BY MERCHANT</p>
              <h2>Top Spending Destinations</h2>
            </div>
          </div>
          <span className="stat-badge">RANKED BY SPEND</span>
        </div>

        {topMerchants.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
            <TrophyIcon size={36} />
            <p style={{ marginTop: "10px" }}>Top merchants will appear here as you log expenses.</p>
          </div>
        ) : (
          <div className="merchant-list">
            {topMerchants.map((merchant, index) => {
              const rankClass = index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "bronze" : "";
              return (
                <div className="merchant-item" key={merchant.name}>
                  <div className={`merchant-rank ${rankClass}`}>
                    #{index + 1}
                  </div>
                  <div className="merchant-info" style={{ flex: 1 }}>
                    <div className="merchant-name">{merchant.name}</div>
                    <div className="merchant-count">
                      {merchant.count} {merchant.count === 1 ? "expense" : "expenses"}
                    </div>
                  </div>
                  <div className="merchant-amount">{formatCurrency(merchant.total)}</div>
                </div>
              );
            })}
          </div>
        )}
      </article>
    </div>
  );
};

export default AnalyticsScreen;
