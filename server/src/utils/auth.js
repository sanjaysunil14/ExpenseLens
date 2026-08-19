import jwt from "jsonwebtoken";

const DEFAULT_SECRET = "expenselens-dev-secret";

const getJwtSecret = () => process.env.JWT_SECRET || DEFAULT_SECRET;

export const createAuthToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
    },
    getJwtSecret(),
    {
      expiresIn: "7d",
    },
  );

export const verifyAuthToken = (token) => jwt.verify(token, getJwtSecret());
