import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "./api.js";
import AnalyticsScreen from "./components/AnalyticsScreen.jsx";
import AuthScreen from "./components/AuthScreen.jsx";
import DashboardScreen from "./components/DashboardScreen.jsx";
import InteractiveBackground from "./components/InteractiveBackground.jsx";
import NavBar from "./components/NavBar.jsx";
import QuickAddModal from "./components/QuickAddModal.jsx";
import CommandPalette from "./components/CommandPalette.jsx";
import CsvImportModal from "./components/CsvImportModal.jsx";
import Toast from "./components/Toast.jsx";
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
import { exportExpensesToCSV } from "./lib/exportCsv.js";

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
  const [currentPage, setCurrentPage] = useState("dashboard");

  // Modals & Command Palette
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });

  // Theme Management (Light / Dark)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("expenselens_theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("expenselens_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast({ message: "", type: "success" });
  };

  // Global Card Mousemove Spotlight Follower (Linear / Raycast effect on ALL cards)
  useEffect(() => {
    const handleGlobalCardMouseMove = (e) => {
      const card = e.target.closest(".card");
      if (card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      }
    };

    window.addEventListener("mousemove", handleGlobalCardMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleGlobalCardMouseMove);
  }, []);

  // Global Keyboard shortcut listener ('⌘K' for Command Palette, 'N' for Quick Add, '/' for search)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tagName = e.target.tagName.toLowerCase();
      const isInput = tagName === "input" || tagName === "textarea" || tagName === "select";

      // ⌘K or Ctrl+K opens Command Palette anywhere
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (token) {
          setIsCmdOpen((prev) => !prev);
        }
        return;
      }

      if (isInput) return;

      // 'N' for Quick Add
      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        if (token) {
          setIsQuickAddOpen(true);
        }
      }

      // '/' for search focus
      if (e.key === "/") {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search by merchant"]');
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [token]);

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
    showToast(message, "error");

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
      await loadDashboard(response.token, filters);
      showToast(isLoginMode ? "Welcome back! Logged in successfully." : "Account created! Welcome to ExpenseLens.");
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
    setCurrentPage("dashboard");
    showToast("Signed out safely.");
  };

  const applyFilters = async (event) => {
    if (event) event.preventDefault();
    setLoading(true);
    setErrorMessage("");

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

    try {
      await loadDashboard(token, nextFilters);
      showToast("Filters reset.");
    } catch (error) {
      handleRequestError(error, true);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterByCategory = (catIdentifier) => {
    const foundCategory = categories.find(
      (c) => String(c.id) === String(catIdentifier) || c.name.toLowerCase() === String(catIdentifier).toLowerCase(),
    );
    const categoryId = foundCategory ? String(foundCategory.id) : "";
    const nextFilters = { ...filters, categoryId };
    setFilters(nextFilters);
    setCurrentPage("dashboard");
    loadDashboard(token, nextFilters);
    showToast(`Filtered by ${foundCategory?.name || "category"}`);
  };

  const handleFilterByMonth = (month) => {
    const nextFilters = { ...filters, month };
    setFilters(nextFilters);
    setCurrentPage("dashboard");
    loadDashboard(token, nextFilters);
    showToast(`Filtered for ${month}`);
  };

  const handleExpenseSubmit = async (event) => {
    event.preventDefault();
    setSubmittingExpense(true);
    setErrorMessage("");

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
      showToast(
        editingExpenseId
          ? "Expense updated successfully."
          : `Expense of ₹${expenseForm.amount} added.`,
      );
    } catch (error) {
      handleRequestError(error, true);
    } finally {
      setSubmittingExpense(false);
    }
  };

  const handleQuickAddSubmit = async (payload) => {
    setSubmittingExpense(true);
    try {
      await apiRequest("/api/expenses", {
        method: "POST",
        headers: createAuthHeaders(token),
        body: JSON.stringify(payload),
      });

      await loadDashboard(token, filters);
      setIsQuickAddOpen(false);
      showToast(`Expense of ₹${payload.amount} logged!`);
    } catch (error) {
      handleRequestError(error, true);
    } finally {
      setSubmittingExpense(false);
    }
  };

  const handleDuplicateExpense = async (expense) => {
    try {
      const payload = {
        merchant: expense.merchant,
        amount: expense.amount,
        categoryId: expense.categoryId,
        expenseDate: new Date().toISOString().slice(0, 10),
        notes: expense.notes ? `Repeat: ${expense.notes}` : "Repeat expense",
      };

      await apiRequest("/api/expenses", {
        method: "POST",
        headers: createAuthHeaders(token),
        body: JSON.stringify(payload),
      });

      await loadDashboard(token, filters);
      showToast(`Duplicated ₹${expense.amount} for ${expense.merchant}!`);
    } catch (error) {
      handleRequestError(error, true);
    }
  };

  const handleBatchImport = async (rows = []) => {
    try {
      const authHeaders = createAuthHeaders(token);
      await Promise.all(
        rows.map((row) =>
          apiRequest("/api/expenses", {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify({
              merchant: row.merchant,
              amount: row.amount,
              categoryId: row.categoryId,
              expenseDate: row.expenseDate,
              notes: row.notes || "Imported via CSV",
            }),
          })
        )
      );

      await loadDashboard(token, filters);
      showToast(`Imported ${rows.length} transactions successfully!`);
    } catch (error) {
      handleRequestError(error, true);
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
    setErrorMessage("");
    setCurrentPage("dashboard");
    window.scrollTo({ top: 400, behavior: "smooth" });
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

    try {
      await apiRequest(`/api/expenses/${expenseId}`, {
        method: "DELETE",
        headers: createAuthHeaders(token),
      });

      await loadDashboard(token, filters);
      showToast("Expense deleted.");

      if (editingExpenseId === expenseId) {
        stopEditingExpense();
      }
    } catch (error) {
      handleRequestError(error, true);
    }
  };

  const handleBulkDeleteExpense = async (ids = []) => {
    try {
      const authHeaders = createAuthHeaders(token);
      await Promise.all(
        ids.map((id) =>
          apiRequest(`/api/expenses/${id}`, {
            method: "DELETE",
            headers: authHeaders,
          })
        )
      );

      await loadDashboard(token, filters);
      showToast(`Deleted ${ids.length} expenses successfully.`);
    } catch (error) {
      handleRequestError(error, true);
    }
  };

  const handleExportStatement = () => {
    const dateStr = new Date().toISOString().slice(0, 10);
    exportExpensesToCSV(expenses, `ExpenseLens_Statement_${dateStr}.csv`);
  };

  if (!token) {
    return (
      <>
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
        <AuthScreen
          authForm={authForm}
          authMode={authMode}
          errorMessage={errorMessage}
          feedback={feedback}
          onAuthFormChange={handleAuthFormChange}
          onModeToggle={handleAuthModeToggle}
          onSubmit={handleAuthSubmit}
          submittingAuth={submittingAuth}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      </>
    );
  }

  return (
    <>
      <InteractiveBackground />
      <Toast message={toast.message} type={toast.type} onClose={closeToast} />

      <CommandPalette
        isOpen={isCmdOpen}
        onClose={() => setIsCmdOpen(false)}
        expenses={expenses}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        onNavigate={setCurrentPage}
        onToggleTheme={toggleTheme}
        theme={theme}
        onExportCsv={handleExportStatement}
        onResetFilters={resetFilters}
        onSelectExpense={handleEditExpense}
      />

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        categories={categories}
        onSubmit={handleQuickAddSubmit}
        submitting={submittingExpense}
      />

      <CsvImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        categories={categories}
        onBatchImport={handleBatchImport}
      />

      <NavBar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        user={user}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
      />

      {currentPage === "analytics" ? (
        <AnalyticsScreen
          summary={summary}
          expenses={expenses}
          categories={categories}
        />
      ) : (
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
          onBulkDeleteExpense={handleBulkDeleteExpense}
          onDuplicateExpense={handleDuplicateExpense}
          onOpenImport={() => setIsImportOpen(true)}
          onExpenseFieldChange={handleExpenseFieldChange}
          onExpenseSubmit={handleExpenseSubmit}
          onFilterChange={handleFilterChange}
          onFilterReset={resetFilters}
          onFilterSubmit={applyFilters}
          onStartEditExpense={handleEditExpense}
          onStopEditingExpense={stopEditingExpense}
          submittingExpense={submittingExpense}
          summary={summary}
          user={user}
          onFilterByCategory={handleFilterByCategory}
          onFilterByMonth={handleFilterByMonth}
        />
      )}
    </>
  );
};

export default App;
