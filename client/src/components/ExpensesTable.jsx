import { formatCurrency } from "../lib/formatters.js";

const ExpensesTable = ({ expenses, onDelete, onEdit }) => (
  <section className="card">
    <div className="card-header">
      <div>
        <p className="eyebrow">Expense history</p>
        <h2>Your recorded expenses</h2>
      </div>
    </div>

    {expenses.length === 0 ? (
      <p className="empty-state">No expenses match the current filters.</p>
    ) : (
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Merchant</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{String(expense.expenseDate).slice(0, 10)}</td>
                <td>{expense.merchant}</td>
                <td>{expense.categoryName}</td>
                <td>{formatCurrency(expense.amount)}</td>
                <td>{expense.notes || "—"}</td>
                <td>
                  <div className="table-actions">
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => onEdit(expense)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => onDelete(expense.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </section>
);

export default ExpensesTable;
