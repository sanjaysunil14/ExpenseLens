import { findUserById } from "../repositories/userRepository.js";
import { createHttpError } from "../utils/httpError.js";

export const getCurrentUser = async (id) => {
  const user = await findUserById(id);

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  return {
    id: Number(user.id),
    name: user.name,
    email: user.email,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
};
