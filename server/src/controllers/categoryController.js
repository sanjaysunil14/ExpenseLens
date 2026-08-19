import { getCategories } from "../services/categoryService.js";

export const listAllCategories = async (req, res, next) => {
  try {
    const categories = await getCategories();

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};
