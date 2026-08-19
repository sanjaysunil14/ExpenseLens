import { LogoIcon, DashboardIcon, AnalyticsIcon, SunIcon, MoonIcon, PlusIcon } from "./Icons.jsx";
import UserAvatar from "./UserAvatar.jsx";

const NavBar = ({
  currentPage,
  onNavigate,
  user,
  onLogout,
  theme,
  onToggleTheme,
  onOpenQuickAdd,
}) => (
  <nav className="navbar">
    <div className="navbar-brand" onClick={() => onNavigate("dashboard")}>
      <div className="navbar-logo-icon">
        <LogoIcon size={20} />
      </div>
      <div>
        <span className="navbar-name">ExpenseLens</span>
      </div>
      <span className="navbar-badge">PRO</span>
    </div>

    <div className="nav-links">
      <button
        className={`nav-link${currentPage === "dashboard" ? " active" : ""}`}
        onClick={() => onNavigate("dashboard")}
        type="button"
      >
        <DashboardIcon size={16} /> Dashboard
      </button>
      <button
        className={`nav-link${currentPage === "analytics" ? " active" : ""}`}
        onClick={() => onNavigate("analytics")}
        type="button"
      >
        <AnalyticsIcon size={16} /> Analytics
      </button>
    </div>

    <div className="navbar-right">
      <button
        type="button"
        className="primary-button nav-quick-add-btn"
        onClick={onOpenQuickAdd}
        title="Quick Add Expense (Press 'N' or ⌘K)"
      >
        <PlusIcon size={15} /> New Expense
        <kbd className="nav-kbd-badge">N</kbd>
      </button>

      <button
        type="button"
        className="theme-toggle-btn"
        onClick={onToggleTheme}
        title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <SunIcon size={18} /> : <MoonIcon size={18} />}
      </button>

      <div className="navbar-user">
        <UserAvatar name={user?.name || "User"} size={36} />
        <div className="user-info-text">
          <span className="user-name">{user?.name || "User"}</span>
          <span className="user-email-subtitle">{user?.email || "Personal Vault"}</span>
        </div>
        <button type="button" className="ghost-button" onClick={onLogout}>
          Sign out
        </button>
      </div>
    </div>
  </nav>
);

export default NavBar;
