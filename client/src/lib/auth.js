import { STORAGE_KEYS } from "../constants/appState.js";

export const getStoredToken = () =>
  window.localStorage.getItem(STORAGE_KEYS.authToken) || "";

export const storeToken = (token) => {
  window.localStorage.setItem(STORAGE_KEYS.authToken, token);
};

export const clearStoredToken = () => {
  window.localStorage.removeItem(STORAGE_KEYS.authToken);
};
