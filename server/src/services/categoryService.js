import { listCategories } from "../repositories/categoryRepository.js";

export const getCategories = async () => {
  const categories = await listCategories();

  return categories.map((category) => ({
    id: Number(category.id),
    name: category.name,
    createdAt: category.created_at,
  }));
};
