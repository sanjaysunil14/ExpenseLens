// Apple Spectral Category color tokens and styling helpers

export const CATEGORY_PALETTES = {
  food: {
    bg: "rgba(245, 158, 11, 0.12)",
    border: "rgba(245, 158, 11, 0.3)",
    text: "#f59e0b",
    color: "#f59e0b",
    icon: "🍔",
  },
  dining: {
    bg: "rgba(245, 158, 11, 0.12)",
    border: "rgba(245, 158, 11, 0.3)",
    text: "#f59e0b",
    color: "#f59e0b",
    icon: "🍽️",
  },
  travel: {
    bg: "rgba(56, 189, 248, 0.12)",
    border: "rgba(56, 189, 248, 0.3)",
    text: "#38bdf8",
    color: "#38bdf8",
    icon: "🚗",
  },
  transport: {
    bg: "rgba(56, 189, 248, 0.12)",
    border: "rgba(56, 189, 248, 0.3)",
    text: "#38bdf8",
    color: "#38bdf8",
    icon: "✈️",
  },
  bills: {
    bg: "rgba(16, 185, 129, 0.12)",
    border: "rgba(16, 185, 129, 0.3)",
    text: "#10b981",
    color: "#10b981",
    icon: "⚡",
  },
  utilities: {
    bg: "rgba(16, 185, 129, 0.12)",
    border: "rgba(16, 185, 129, 0.3)",
    text: "#10b981",
    color: "#10b981",
    icon: "💡",
  },
  shopping: {
    bg: "rgba(244, 63, 94, 0.12)",
    border: "rgba(244, 63, 94, 0.3)",
    text: "#f43f5e",
    color: "#f43f5e",
    icon: "🛍️",
  },
  tech: {
    bg: "rgba(129, 140, 248, 0.12)",
    border: "rgba(129, 140, 248, 0.3)",
    text: "#818cf8",
    color: "#818cf8",
    icon: "💻",
  },
  office: {
    bg: "rgba(129, 140, 248, 0.12)",
    border: "rgba(129, 140, 248, 0.3)",
    text: "#818cf8",
    color: "#818cf8",
    icon: "💼",
  },
  health: {
    bg: "rgba(192, 132, 252, 0.12)",
    border: "rgba(192, 132, 252, 0.3)",
    text: "#c084fc",
    color: "#c084fc",
    icon: "💊",
  },
  medical: {
    bg: "rgba(192, 132, 252, 0.12)",
    border: "rgba(192, 132, 252, 0.3)",
    text: "#c084fc",
    color: "#c084fc",
    icon: "🏥",
  },
  entertainment: {
    bg: "rgba(251, 146, 60, 0.12)",
    border: "rgba(251, 146, 60, 0.3)",
    text: "#fb923c",
    color: "#fb923c",
    icon: "🎬",
  },
  education: {
    bg: "rgba(56, 189, 248, 0.12)",
    border: "rgba(56, 189, 248, 0.3)",
    text: "#38bdf8",
    color: "#38bdf8",
    icon: "📚",
  },
};

const DEFAULT_PALETTE = {
  bg: "rgba(100, 116, 139, 0.12)",
  border: "rgba(100, 116, 139, 0.25)",
  text: "var(--accent-cyan)",
  color: "#38bdf8",
  icon: "🏷️",
};

export const getCategoryTheme = (categoryName = "") => {
  const normalized = categoryName.toLowerCase();
  for (const [key, palette] of Object.entries(CATEGORY_PALETTES)) {
    if (normalized.includes(key)) {
      return palette;
    }
  }
  return DEFAULT_PALETTE;
};
