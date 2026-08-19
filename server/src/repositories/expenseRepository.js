import pool from "../config/db.js";

const buildExpenseFilters = (userId, filters) => {
  const values = [userId];
  const conditions = ["expense.user_id = $1"];

  if (filters.search) {
    values.push(`%${filters.search}%`);
    const index = values.length;
    conditions.push(
      `(expense.merchant ILIKE $${index} OR COALESCE(expense.notes, '') ILIKE $${index})`,
    );
  }

  if (filters.categoryId) {
    values.push(filters.categoryId);
    conditions.push(`expense.category_id = $${values.length}`);
  }

  if (filters.month) {
    values.push(filters.month);
    conditions.push(`TO_CHAR(expense.expense_date, 'YYYY-MM') = $${values.length}`);
  }

  return { conditions, values };
};

const expenseSelect = `
  SELECT
    expense.id,
    expense.user_id,
    expense.merchant,
    expense.amount,
    expense.notes,
    expense.expense_date,
    expense.created_at,
    expense.updated_at,
    expense.category_id,
    COALESCE(category.name, expense.category, 'Other') AS category_name
  FROM expenses AS expense
  LEFT JOIN categories AS category
    ON category.id = expense.category_id
`;

export const listExpensesByUser = async (userId, filters) => {
  const { conditions, values } = buildExpenseFilters(userId, filters);
  const result = await pool.query(
    `
      ${expenseSelect}
      WHERE ${conditions.join(" AND ")}
      ORDER BY expense.expense_date DESC, expense.id DESC
    `,
    values,
  );

  return result.rows;
};

export const findExpenseById = async (id, userId) => {
  const result = await pool.query(
    `
      ${expenseSelect}
      WHERE expense.id = $1 AND expense.user_id = $2
      LIMIT 1
    `,
    [id, userId],
  );

  return result.rows[0] || null;
};

export const createExpense = async ({
  userId,
  merchant,
  amount,
  notes,
  expenseDate,
  categoryId,
}) => {
  const result = await pool.query(
    `
      INSERT INTO expenses (
        user_id,
        merchant,
        amount,
        notes,
        expense_date,
        category_id,
        category,
        updated_at
      )
      SELECT
        $1,
        $2,
        $3,
        $4,
        $5,
        category.id,
        category.name,
        CURRENT_TIMESTAMP
      FROM categories AS category
      WHERE category.id = $6
      RETURNING id
    `,
    [userId, merchant, amount, notes, expenseDate, categoryId],
  );

  return result.rows[0] || null;
};

export const updateExpense = async ({
  id,
  userId,
  merchant,
  amount,
  notes,
  expenseDate,
  categoryId,
}) => {
  const result = await pool.query(
    `
      UPDATE expenses AS expense
      SET
        merchant = $3,
        amount = $4,
        notes = $5,
        expense_date = $6,
        category_id = category.id,
        category = category.name,
        updated_at = CURRENT_TIMESTAMP
      FROM categories AS category
      WHERE expense.id = $1
        AND expense.user_id = $2
        AND category.id = $7
      RETURNING expense.id
    `,
    [id, userId, merchant, amount, notes, expenseDate, categoryId],
  );

  return result.rows[0] || null;
};

export const deleteExpense = async (id, userId) => {
  const result = await pool.query(
    `
      DELETE FROM expenses
      WHERE id = $1 AND user_id = $2
      RETURNING id
    `,
    [id, userId],
  );

  return result.rows[0] || null;
};

export const getExpenseSummary = async (userId, filters) => {
  const { conditions, values } = buildExpenseFilters(userId, filters);
  const whereClause = conditions.join(" AND ");

  const [totalsResult, byCategoryResult, byMonthResult] = await Promise.all([
    pool.query(
      `
        SELECT
          COUNT(*)::int AS expense_count,
          COALESCE(SUM(expense.amount), 0)::float8 AS total_amount
        FROM expenses AS expense
        WHERE ${whereClause}
      `,
      values,
    ),
    pool.query(
      `
        SELECT
          COALESCE(category.name, expense.category, 'Other') AS category_name,
          COALESCE(SUM(expense.amount), 0)::float8 AS total_amount
        FROM expenses AS expense
        LEFT JOIN categories AS category
          ON category.id = expense.category_id
        WHERE ${whereClause}
        GROUP BY COALESCE(category.name, expense.category, 'Other')
        ORDER BY total_amount DESC, category_name ASC
      `,
      values,
    ),
    pool.query(
      `
        SELECT
          TO_CHAR(DATE_TRUNC('month', expense.expense_date), 'YYYY-MM') AS month,
          COALESCE(SUM(expense.amount), 0)::float8 AS total_amount
        FROM expenses AS expense
        WHERE ${whereClause}
        GROUP BY DATE_TRUNC('month', expense.expense_date)
        ORDER BY DATE_TRUNC('month', expense.expense_date) DESC
        LIMIT 6
      `,
      values,
    ),
  ]);

  return {
    totals: totalsResult.rows[0],
    byCategory: byCategoryResult.rows,
    byMonth: byMonthResult.rows.reverse(),
  };
};
