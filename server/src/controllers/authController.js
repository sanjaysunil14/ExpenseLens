import { loginUser, registerUser } from "../services/authService.js";

export const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.validatedBody);

    res.status(201).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.validatedBody);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
