import { formatCurrency } from "../lib/formatters.js";

const InsightsSection = ({ summary }) => (
  <section className="insights-grid">
    <article className="card">
      <div className="card-header">
        <div>
          <p className="eyebrow">Category totals</p>
          <h2>Where your money is going</h2>
        </div>
      </div>

      <div className="bars-list">
        {summary.byCategory.length === 0 ? (
          <p className="empty-state">Add your first expense to see category insights.</p>
        ) : (
          summary.byCategory.map((item) => {
            const maxAmount = summary.byCategory[0]?.totalAmount || 1;
            const width = `${Math.max((item.totalAmount / maxAmount) * 100, 8)}%`;

            return (
              <div className="bar-row" key={item.categoryName}>
                <div className="bar-label">
                  <span>{item.categoryName}</span>
                  <strong>{formatCurrency(item.totalAmount)}</strong>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width }} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </article>

    <article className="card">
      <div className="card-header">
        <div>
          <p className="eyebrow">Monthly totals</p>
          <h2>Recent spending trend</h2>
        </div>
      </div>

      <div className="month-grid">
        {summary.byMonth.length === 0 ? (
          <p className="empty-state">
            Monthly totals will appear here as you add expenses.
          </p>
        ) : (
          summary.byMonth.map((item) => (
            <div className="month-card" key={item.month}>
              <span>{item.month}</span>
              <strong>{formatCurrency(item.totalAmount)}</strong>
            </div>
          ))
        )}
      </div>
    </article>
  </section>
);

export default InsightsSection;
