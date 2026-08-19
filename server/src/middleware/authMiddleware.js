import { verifyAuthToken } from "../utils/auth.js";
import { createHttpError } from "../utils/httpError.js";

export const requireAuth = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    return next(createHttpError(401, "Authentication token is required"));
  }

  const token = authorizationHeader.slice("Bearer ".length);

  try {
    const payload = verifyAuthToken(token);
    req.user = {
      id: Number(payload.sub),
      email: payload.email,
      name: payload.name,
    };
    next();
  } catch (error) {
    next(createHttpError(401, "Invalid or expired authentication token"));
  }
};
