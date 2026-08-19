import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "./api.js";
import AuthScreen from "./components/AuthScreen.jsx";
import DashboardScreen from "./components/DashboardScreen.jsx";
import {
  emptyExpenseForm,
  emptySummary,
  initialAuthForm,
} from "./constants/appState.js";
import { clearStoredToken, getStoredToken, storeToken } from "./lib/auth.js";
import {
  buildExpenseQueryString,
  createAuthHeaders,
  getMonthOptions,
} from "./lib/dashboard.js";

const App = () => {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(emptySummary);
  const [filters, setFilters] = useState({
    search: "",
    categoryId: "",
    month: "",
  });
  const [expenseForm, setExpenseForm] = useState(emptyExpenseForm);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState(initialAuthForm);
  const [loading, setLoading] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(Boolean(token));
  const [submittingExpense, setSubmittingExpense] = useState(false);
  const [submittingAuth, setSubmittingAuth] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const monthOptions = useMemo(
    () => getMonthOptions(expenses, summary),
    [expenses, summary],
  );

  const resetDashboardState = () => {
    setUser(null);
    setCategories([]);
    setExpenses([]);
    setSummary(emptySummary);
    setExpenseForm(emptyExpenseForm);
    setEditingExpenseId(null);
  };

  const handleRequestError = (error, shouldLogoutOnAuthFailure = false) => {
    const message = error?.payload?.message || error.message || "Something went wrong";
    setErrorMessage(message);
    setFeedback("");

    if (shouldLogoutOnAuthFailure && error.statusCode === 401) {
      clearStoredToken();
      setToken("");
      resetDashboardState();
    }
  };

  const loadDashboard = async (activeToken = token, activeFilters = filters) => {
    if (!activeToken) {
      return;
    }

    const queryString = buildExpenseQueryString(activeFilters);
    const authHeaders = createAuthHeaders(activeToken);

    const [userResponse, categoryResponse, expenseResponse, summaryResponse] =
      await Promise.all([
        apiRequest("/api/users/me", { headers: authHeaders }),
        apiRequest("/api/categories", { headers: authHeaders }),
        apiRequest(`/api/expenses${queryString}`, { headers: authHeaders }),
        apiRequest(`/api/expenses/summary${queryString}`, { headers: authHeaders }),
      ]);

    setUser(userResponse.user);
    setCategories(categoryResponse.categories);
    setExpenses(expenseResponse.expenses);
    setSummary(summaryResponse.summary);
  };

  useEffect(() => {
    if (!token) {
      setBootstrapping(false);
      return;
    }

    const bootstrap = async () => {
      setBootstrapping(true);

      try {
        await loadDashboard(token, filters);
      } catch (error) {
        handleRequestError(error, true);
      } finally {
        setBootstrapping(false);
      }
    };

    bootstrap();
  }, [token]);

  const handleAuthFormChange = (field, value) => {
    setAuthForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleExpenseFieldChange = (field, value) => {
    setExpenseForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleFilterChange = (field, value) => {
    setFilters((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleAuthModeToggle = () => {
    setAuthMode((currentMode) => (currentMode === "login" ? "register" : "login"));
    setErrorMessage("");
    setFeedback("");
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setSubmittingAuth(true);
    setErrorMessage("");
    setFeedback("");

    try {
      const isLoginMode = authMode === "login";
      const path = isLoginMode ? "/api/auth/login" : "/api/auth/register";
      const payload = isLoginMode
        ? {
            email: authForm.email,
            password: authForm.password,
          }
        : authForm;

      const response = await apiRequest(path, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      storeToken(response.token);
      setToken(response.token);
      setUser(response.user);
      setAuthForm(initialAuthForm);
      setFeedback(
        isLoginMode
          ? "Welcome back. Your dashboard is ready."
          : "Account created successfully.",
      );
    } catch (error) {
      handleRequestError(error);
    } finally {
      setSubmittingAuth(false);
    }
  };

  const handleLogout = () => {
    clearStoredToken();
    setToken("");
    resetDashboardState();
    setFeedback("You have been signed out.");
    setErrorMessage("");
  };

  const applyFilters = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setFeedback("");

    try {
      await loadDashboard(token, filters);
    } catch (error) {
      handleRequestError(error, true);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = async () => {
    const nextFilters = {
      search: "",
      categoryId: "",
      month: "",
    };

    setFilters(nextFilters);
    setLoading(true);
    setErrorMessage("");
    setFeedback("");

    try {
      await loadDashboard(token, nextFilters);
    } catch (error) {
      handleRequestError(error, true);
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseSubmit = async (event) => {
    event.preventDefault();
    setSubmittingExpense(true);
    setErrorMessage("");
    setFeedback("");

    try {
      const path = editingExpenseId
        ? `/api/expenses/${editingExpenseId}`
        : "/api/expenses";
      const method = editingExpenseId ? "PUT" : "POST";

      await apiRequest(path, {
        method,
        headers: createAuthHeaders(token),
        body: JSON.stringify(expenseForm),
      });

      await loadDashboard(token, filters);
      setExpenseForm(emptyExpenseForm);
      setEditingExpenseId(null);
      setFeedback(
        editingExpenseId
          ? "Expense updated successfully."
          : "Expense added successfully.",
      );
    } catch (error) {
      handleRequestError(error, true);
    } finally {
      setSubmittingExpense(false);
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpenseId(expense.id);
    setExpenseForm({
      merchant: expense.merchant,
      amount: String(expense.amount),
      categoryId: String(expense.categoryId || ""),
      expenseDate: String(expense.expenseDate).slice(0, 10),
      notes: expense.notes || "",
    });
    setFeedback("");
    setErrorMessage("");
  };

  const stopEditingExpense = () => {
    setEditingExpenseId(null);
    setExpenseForm(emptyExpenseForm);
  };

  const handleDeleteExpense = async (expenseId) => {
    const confirmed = window.confirm("Delete this expense?");

    if (!confirmed) {
      return;
    }

    setErrorMessage("");
    setFeedback("");

    try {
      await apiRequest(`/api/expenses/${expenseId}`, {
        method: "DELETE",
        headers: createAuthHeaders(token),
      });

      await loadDashboard(token, filters);
      setFeedback("Expense deleted successfully.");

      if (editingExpenseId === expenseId) {
        stopEditingExpense();
      }
    } catch (error) {
      handleRequestError(error, true);
    }
  };

  if (!token) {
    return (
      <AuthScreen
        authForm={authForm}
        authMode={authMode}
        errorMessage={errorMessage}
        feedback={feedback}
        onAuthFormChange={handleAuthFormChange}
        onModeToggle={handleAuthModeToggle}
        onSubmit={handleAuthSubmit}
        submittingAuth={submittingAuth}
      />
    );
  }

  return (
    <DashboardScreen
      bootstrapping={bootstrapping}
      categories={categories}
      editingExpenseId={editingExpenseId}
      errorMessage={errorMessage}
      expenseForm={expenseForm}
      expenses={expenses}
      feedback={feedback}
      filters={filters}
      loading={loading}
      monthOptions={monthOptions}
      onDeleteExpense={handleDeleteExpense}
      onExpenseFieldChange={handleExpenseFieldChange}
      onExpenseSubmit={handleExpenseSubmit}
      onFilterChange={handleFilterChange}
      onFilterReset={resetFilters}
      onFilterSubmit={applyFilters}
      onLogout={handleLogout}
      onStartEditExpense={handleEditExpense}
      onStopEditingExpense={stopEditingExpense}
      submittingExpense={submittingExpense}
      summary={summary}
      user={user}
    />
  );
};

export default App;
