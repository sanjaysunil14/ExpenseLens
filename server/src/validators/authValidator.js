const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmail = (email) => email.trim().toLowerCase();

export const validateRegistration = (body) => {
  const errors = [];
  const name = body?.name?.trim() || "";
  const email = body?.email?.trim() || "";
  const password = body?.password || "";

  if (name.length < 2) {
    errors.push("Name must be at least 2 characters long");
  }

  if (!emailPattern.test(email)) {
    errors.push("A valid email address is required");
  }

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  return {
    valid: errors.length === 0,
    errors,
    value: {
      name,
      email: normalizeEmail(email),
      password,
    },
  };
};

export const validateLogin = (body) => {
  const errors = [];
  const email = body?.email?.trim() || "";
  const password = body?.password || "";

  if (!emailPattern.test(email)) {
    errors.push("A valid email address is required");
  }

  if (!password) {
    errors.push("Password is required");
  }

  return {
    valid: errors.length === 0,
    errors,
    value: {
      email: normalizeEmail(email),
      password,
    },
  };
};
