import { formatCurrency } from "../lib/formatters.js";
import ExpenseFormCard from "./ExpenseFormCard.jsx";
import ExpensesTable from "./ExpensesTable.jsx";
import FiltersCard from "./FiltersCard.jsx";
import InsightsSection from "./InsightsSection.jsx";

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
  onExpenseFieldChange,
  onExpenseSubmit,
  onFilterChange,
  onFilterReset,
  onFilterSubmit,
  onLogout,
  onStartEditExpense,
  onStopEditingExpense,
  submittingExpense,
  summary,
  user,
}) => (
  <div className="page-shell dashboard-shell">
    <header className="topbar">
      <div>
        <p className="eyebrow">ExpenseLens dashboard</p>
        <h1>Hello, {user?.name || "there"}</h1>
      </div>
      <div className="topbar-actions">
        <span>{user?.email}</span>
        <button type="button" className="ghost-button" onClick={onLogout}>
          Log out
        </button>
      </div>
    </header>

    {bootstrapping ? (
      <section className="card">
        <p>Loading your dashboard...</p>
      </section>
    ) : (
      <>
        <section className="stats-grid">
          <article className="card stat-card">
            <p>Total spend</p>
            <strong>{formatCurrency(summary.totalAmount)}</strong>
          </article>
          <article className="card stat-card">
            <p>Expenses tracked</p>
            <strong>{summary.expenseCount}</strong>
          </article>
          <article className="card stat-card">
            <p>Top category</p>
            <strong>{summary.byCategory[0]?.categoryName || "No data yet"}</strong>
          </article>
        </section>

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

        <InsightsSection summary={summary} />

        <ExpensesTable
          expenses={expenses}
          onDelete={onDeleteExpense}
          onEdit={onStartEditExpense}
        />
      </>
    )}
  </div>
);

export default DashboardScreen;
