import pool from "../config/db.js";

export const listCategories = async () => {
  const result = await pool.query(
    `
      SELECT id, name, created_at
      FROM categories
      ORDER BY name
    `,
  );

  return result.rows;
};

export const findCategoryById = async (id) => {
  const result = await pool.query(
    `
      SELECT id, name, created_at
      FROM categories
      WHERE id = $1
      LIMIT 1
    `,
    [id],
  );

  return result.rows[0] || null;
};
