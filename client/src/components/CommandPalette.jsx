import { useState, useEffect, useRef } from "react";
import { SearchIcon, PlusIcon, DashboardIcon, AnalyticsIcon, SunIcon, MoonIcon, TrashIcon } from "./Icons.jsx";
import { formatCurrency } from "../lib/formatters.js";

const CommandPalette = ({
  isOpen,
  onClose,
  expenses = [],
  onOpenQuickAdd,
  onNavigate,
  onToggleTheme,
  theme,
  onExportCsv,
  onResetFilters,
  onSelectExpense,
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Actions list
  const staticActions = [
    {
      id: "new_expense",
      title: "Add New Expense",
      subtitle: "Quick log transaction",
      icon: <PlusIcon size={16} />,
      shortcut: "N",
      run: () => {
        onClose();
        onOpenQuickAdd();
      },
    },
    {
      id: "go_dashboard",
      title: "Go to Dashboard",
      subtitle: "Main overview & expenses",
      icon: <DashboardIcon size={16} />,
      shortcut: "G D",
      run: () => {
        onClose();
        onNavigate("dashboard");
      },
    },
    {
      id: "go_analytics",
      title: "Go to Analytics",
      subtitle: "Detailed spending charts",
      icon: <AnalyticsIcon size={16} />,
      shortcut: "G A",
      run: () => {
        onClose();
        onNavigate("analytics");
      },
    },
    {
      id: "export_csv",
      title: "Export Statement (CSV)",
      subtitle: "Download spreadsheet",
      icon: <span>📥</span>,
      shortcut: "E",
      run: () => {
        onClose();
        onExportCsv();
      },
    },
    {
      id: "toggle_theme",
      title: theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
      subtitle: "Change application theme",
      icon: theme === "dark" ? <SunIcon size={16} /> : <MoonIcon size={16} />,
      shortcut: "T",
      run: () => {
        onToggleTheme();
      },
    },
    {
      id: "reset_filters",
      title: "Reset All Filters",
      subtitle: "Clear active searches",
      icon: <span>🔄</span>,
      shortcut: "R",
      run: () => {
        onClose();
        onResetFilters();
      },
    },
  ];

  // Filtered actions
  const matchedActions = staticActions.filter(
    (action) =>
      action.title.toLowerCase().includes(query.toLowerCase()) ||
      action.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  // Filtered expense search results
  const matchedExpenses = query.trim()
    ? expenses
        .filter(
          (e) =>
            e.merchant?.toLowerCase().includes(query.toLowerCase()) ||
            e.categoryName?.toLowerCase().includes(query.toLowerCase()) ||
            e.notes?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const totalItems = matchedActions.length + matchedExpenses.length;

  // Keyboard navigation inside command palette
  useEffect(() => {
    const handleKey = (e) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (totalItems || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + totalItems) % (totalItems || 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIndex < matchedActions.length) {
          matchedActions[selectedIndex]?.run();
        } else {
          const expenseIndex = selectedIndex - matchedActions.length;
          const exp = matchedExpenses[expenseIndex];
          if (exp) {
            onClose();
            onSelectExpense(exp);
          }
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, totalItems, selectedIndex, matchedActions, matchedExpenses, onClose]);

  if (!isOpen) return null;

  return (
    <div className="cmd-backdrop" onClick={onClose}>
      <div className="cmd-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cmd-input-row">
          <SearchIcon size={18} className="cmd-search-icon" />
          <input
            ref={inputRef}
            className="cmd-input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search expenses..."
          />
          <kbd className="kbd-shortcut-badge">ESC</kbd>
        </div>

        <div className="cmd-results-list">
          {/* Quick Actions Group */}
          {matchedActions.length > 0 && (
            <div className="cmd-group">
              <div className="cmd-group-label">ACTIONS</div>
              {matchedActions.map((action, idx) => (
                <div
                  key={action.id}
                  className={`cmd-item ${idx === selectedIndex ? "active" : ""}`}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={action.run}
                >
                  <div className="cmd-item-icon">{action.icon}</div>
                  <div className="cmd-item-info">
                    <span className="cmd-item-title">{action.title}</span>
                    <span className="cmd-item-sub">{action.subtitle}</span>
                  </div>
                  {action.shortcut && (
                    <kbd className="cmd-item-badge">{action.shortcut}</kbd>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Matched Expenses Group */}
          {matchedExpenses.length > 0 && (
            <div className="cmd-group">
              <div className="cmd-group-label">MATCHED EXPENSES</div>
              {matchedExpenses.map((exp, idx) => {
                const itemIndex = matchedActions.length + idx;
                return (
                  <div
                    key={exp.id}
                    className={`cmd-item ${itemIndex === selectedIndex ? "active" : ""}`}
                    onMouseEnter={() => setSelectedIndex(itemIndex)}
                    onClick={() => {
                      onClose();
                      onSelectExpense(exp);
                    }}
                  >
                    <div className="cmd-item-icon">🧾</div>
                    <div className="cmd-item-info">
                      <span className="cmd-item-title">{exp.merchant}</span>
                      <span className="cmd-item-sub">
                        {String(exp.expenseDate).slice(0, 10)} • {exp.categoryName}
                      </span>
                    </div>
                    <strong className="cmd-item-amount">{formatCurrency(exp.amount)}</strong>
                  </div>
                );
              })}
            </div>
          )}

          {totalItems === 0 && (
            <div className="cmd-empty">
              <span>No matching commands or transactions found for &ldquo;{query}&rdquo;</span>
            </div>
          )}
        </div>

        <div className="cmd-footer">
          <span>Navigate with <kbd>↑</kbd> <kbd>↓</kbd></span>
          <span>Select with <kbd>↵ Enter</kbd></span>
          <span>Close with <kbd>Esc</kbd></span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
