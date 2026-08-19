import pool from "../config/db.js";

export const getApiStatus = (req, res) => {
  res.json({
    message: "ExpenseLens API is running.",
  });
};

export const getDatabaseStatus = async (req, res, next) => {
  try {
    const result = await pool.query(
      "select current_database() AS database, current_user AS user",
    );

    res.json({
      message: "Database connected successfully",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};
