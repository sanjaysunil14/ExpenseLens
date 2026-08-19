import pool from "./db.js";

const defaultCategories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Education",
  "Travel",
  "Other",
];

export const initializeDatabase = async () => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id BIGSERIAL PRIMARY KEY,
        user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        merchant VARCHAR(255) NOT NULL,
        amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
        category VARCHAR(100),
        expense_date DATE NOT NULL,
        notes TEXT,
        receipt_image_path TEXT,
        ocr_text TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      ALTER TABLE expenses
      ADD COLUMN IF NOT EXISTS category_id BIGINT REFERENCES categories(id) ON DELETE RESTRICT
    `);

    await client.query(`
      ALTER TABLE expenses
      ADD COLUMN IF NOT EXISTS merchant VARCHAR(255)
    `);

    await client.query(`
      ALTER TABLE expenses
      ADD COLUMN IF NOT EXISTS notes TEXT
    `);

    await client.query(`
      ALTER TABLE expenses
      ADD COLUMN IF NOT EXISTS expense_date DATE DEFAULT CURRENT_DATE
    `);

    await client.query(`
      ALTER TABLE expenses
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    `);

    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique_idx
      ON users (LOWER(email))
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS expenses_user_date_idx
      ON expenses (user_id, expense_date DESC)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS expenses_category_idx
      ON expenses (category_id)
    `);

    for (const categoryName of defaultCategories) {
      await client.query(
        `
          INSERT INTO categories (name)
          VALUES ($1)
          ON CONFLICT (name) DO NOTHING
        `,
        [categoryName],
      );
    }

    await client.query(`
      INSERT INTO categories (name)
      SELECT DISTINCT TRIM(category)
      FROM expenses
      WHERE category IS NOT NULL AND TRIM(category) <> ''
      ON CONFLICT (name) DO NOTHING
    `);

    await client.query(`
      UPDATE expenses AS expense
      SET category_id = category_ref.id
      FROM categories AS category_ref
      WHERE expense.category_id IS NULL
        AND expense.category IS NOT NULL
        AND TRIM(expense.category) <> ''
        AND LOWER(TRIM(expense.category)) = LOWER(category_ref.name)
    `);

    await client.query(`
      UPDATE expenses
      SET updated_at = COALESCE(updated_at, created_at, CURRENT_TIMESTAMP)
      WHERE updated_at IS NULL
    `);

    await client.query(`
      UPDATE users
      SET updated_at = COALESCE(updated_at, created_at, CURRENT_TIMESTAMP)
      WHERE updated_at IS NULL
    `);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
