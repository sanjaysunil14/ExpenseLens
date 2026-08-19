import bcrypt from "bcryptjs";
import {
  createUser,
  findUserByEmail,
} from "../repositories/userRepository.js";
import { createAuthToken } from "../utils/auth.js";
import { createHttpError } from "../utils/httpError.js";

const sanitizeUser = (user) => ({
  id: Number(user.id),
  name: user.name,
  email: user.email,
  createdAt: user.created_at,
  updatedAt: user.updated_at,
});

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw createHttpError(409, "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser({ name, email, passwordHash });

  return {
    token: createAuthToken(user),
    user: sanitizeUser(user),
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw createHttpError(401, "Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatches) {
    throw createHttpError(401, "Invalid email or password");
  }

  return {
    token: createAuthToken(user),
    user: sanitizeUser(user),
  };
};
