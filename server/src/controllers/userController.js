import { getCurrentUser } from "../services/userService.js";

export const getMe = async (req, res, next) => {
  try {
    const user = await getCurrentUser(req.user.id);

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
