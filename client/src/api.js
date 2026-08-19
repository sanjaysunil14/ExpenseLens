const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const buildUrl = (path) => `${API_BASE_URL}${path}`;

export const apiRequest = async (path, options = {}) => {
  const response = await fetch(buildUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const error = new Error(data?.message || "Request failed");
    error.statusCode = response.status;
    error.payload = data;
    throw error;
  }

  return data;
};
