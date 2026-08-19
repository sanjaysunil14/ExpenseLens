import { formatCurrency } from "../lib/formatters.js";
import { WalletIcon, ReceiptIcon, TagIcon, LogoIcon } from "./Icons.jsx";
import VerdictBar from "./VerdictBar.jsx";
import SmartInsightsCard from "./SmartInsightsCard.jsx";
import BudgetCard from "./BudgetCard.jsx";
import ExpenseFormCard from "./ExpenseFormCard.jsx";
import ExpensesTable from "./ExpensesTable.jsx";
import FiltersCard from "./FiltersCard.jsx";
import InsightsSection from "./InsightsSection.jsx";
import Sparkline from "./Sparkline.jsx";
import CategoryDonutChart from "./CategoryDonutChart.jsx";
import CountUp from "./CountUp.jsx";

const DashboardScreen = ({
  bootstrapping,
  categories,
  editingExpenseId,
  errorMessage,
  expenseForm,
  expenses,
  feedback,
  filters,
  loading,
  monthOptions,
  onDeleteExpense,
  onBulkDeleteExpense,
  onDuplicateExpense,
  onOpenImport,
  onExpenseFieldChange,
  onExpenseSubmit,
  onFilterChange,
  onFilterReset,
  onFilterSubmit,
  onStartEditExpense,
  onStopEditingExpense,
  submittingExpense,
  summary,
  user,
  onFilterByCategory,
  onFilterByMonth,
}) => {
  return (
    <div className="page-shell dashboard-shell">
      {/* Top Banner / Greeting */}
      <div className="dashboard-greeting">
        <div className="greeting-text">
          <p className="eyebrow">DASHBOARD</p>
          <h1>
            Welcome back, <span className="gradient-text">{user?.name || "Friend"}</span>
          </h1>
          <p>Here is your real-time spending telemetry and financial health.</p>
        </div>
      </div>

      {/* 2-Second Financial Verdict Bar (Mercury / Copilot Style) */}
      {!bootstrapping && (
        <VerdictBar summary={summary} expenses={expenses} />
      )}

      {bootstrapping ? (
        <section className="card" style={{ textAlign: "center", padding: "50px 20px" }}>
          <div className="navbar-logo-icon" style={{ margin: "0 auto 14px", animation: "spinSlow 3s linear infinite" }}>
            <LogoIcon size={22} />
          </div>
          <h3 style={{ margin: 0, color: "var(--text-heading)" }}>Loading your dashboard...</h3>
          <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>Fetching your expense data</p>
        </section>
      ) : (
        <>
          {/* Top 3 Stat Cards with Animated CountUp & Sparklines */}
          <section className="stats-grid">
            <article className="card stat-card glow-card">
              <div className="stat-card-top">
                <span className="stat-badge">TOTAL SPENT</span>
                <div className="stat-icon-wrap">
                  <WalletIcon size={22} />
                </div>
              </div>
              <div className="stat-middle-row">
                <div>
                  <span className="stat-label">Total Expenses</span>
                  <div className="stat-value">
                    <CountUp end={summary.totalAmount} />
                  </div>
                </div>
                <Sparkline data={[20, 35, 25, 55, 45, 70, 60, 85]} color="#00f0ff" />
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
              <div className="stat-middle-row">
                <div>
                  <span className="stat-label">Expenses Tracked</span>
                  <div className="stat-value">
                    <CountUp end={summary.expenseCount} isCurrency={false} /> entries
                  </div>
                </div>
                <Sparkline data={[10, 25, 15, 40, 30, 60, 50, 70]} color="#f59e0b" />
              </div>
              <div className="stat-accent-strip amber" />
            </article>

            <article className="card stat-card">
              <div className="stat-card-top">
                <span className="stat-badge" style={{ background: "rgba(16, 185, 129, 0.12)", color: "var(--accent-mint)", borderColor: "rgba(16, 185, 129, 0.3)" }}>
                  TOP CATEGORY
                </span>
                <div className="stat-icon-wrap" style={{ boxShadow: "0 0 16px rgba(16, 185, 129, 0.25)" }}>
                  <TagIcon size={22} />
                </div>
              </div>
              <div className="stat-middle-row">
                <div>
                  <span className="stat-label">Highest Spending Area</span>
                  <div className="stat-value" style={{ fontSize: "1.45rem" }}>
                    {summary.byCategory[0]?.categoryName || "No expenses yet"}
                  </div>
                </div>
                <Sparkline data={[15, 30, 20, 50, 45, 65, 80, 95]} color="#10b981" />
              </div>
              <div className="stat-accent-strip mint" />
            </article>
          </section>

          {/* Monthly Budget Target Gauge */}
          <BudgetCard totalSpent={summary.totalAmount} />

          {/* Smart Insights & Anomaly Analysis (Ramp Style) */}
          <SmartInsightsCard expenses={expenses} summary={summary} />

          {/* Form & Filter Split Grid */}
          <section className="content-grid">
            <ExpenseFormCard
              categories={categories}
              editingExpenseId={editingExpenseId}
              errorMessage={errorMessage}
              expenseForm={expenseForm}
              feedback={feedback}
              onCancelEdit={onStopEditingExpense}
              onChange={onExpenseFieldChange}
              onSubmit={onExpenseSubmit}
              submittingExpense={submittingExpense}
            />

            <FiltersCard
              categories={categories}
              filters={filters}
              loading={loading}
              monthOptions={monthOptions}
              onChange={onFilterChange}
              onReset={onFilterReset}
              onSubmit={onFilterSubmit}
            />
          </section>

          {/* Category Donut & Analytics Visualizer */}
          <section className="insights-grid">
            <article className="card">
              <div className="card-header">
                <div className="card-header-content">
                  <div className="card-header-icon">
                    <TagIcon size={20} />
                  </div>
                  <div>
                    <p className="eyebrow">VISUAL BREAKDOWN</p>
                    <h2>Category Allocation</h2>
                  </div>
                </div>
                <span className="stat-badge">INTERACTIVE</span>
              </div>
              <CategoryDonutChart
                byCategory={summary.byCategory}
                totalAmount={summary.totalAmount}
                onSelectCategory={onFilterByCategory}
              />
            </article>

            {/* Monthly Trend & Progress */}
            <InsightsSection
              summary={summary}
              onFilterByCategory={onFilterByCategory}
              onFilterByMonth={onFilterByMonth}
              hideCategoryBar
            />
          </section>

          {/* Expenses Table with Density Switcher, Receipt Drawer, and CSV Actions */}
          <ExpensesTable
            expenses={expenses}
            filters={filters}
            onDelete={onDeleteExpense}
            onBulkDelete={onBulkDeleteExpense}
            onDuplicate={onDuplicateExpense}
            onOpenImport={onOpenImport}
            onEdit={onStartEditExpense}
            onClearFilter={onFilterReset}
          />
        </>
      )}
    </div>
  );
};

export default DashboardScreen;
