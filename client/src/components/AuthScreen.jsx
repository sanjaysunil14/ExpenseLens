import { ZapIcon, BarChartIcon, ShieldIcon, SunIcon, MoonIcon, LogoIcon } from "./Icons.jsx";
import GtaLoadingBackground from "./GtaLoadingBackground.jsx";

const AuthScreen = ({
  authForm,
  authMode,
  errorMessage,
  feedback,
  onAuthFormChange,
  onModeToggle,
  onSubmit,
  submittingAuth,
  theme,
  onToggleTheme,
}) => {
  return (
    <>
      {/* GTA-Style Dynamic Animated Background with Real Imagery */}
      <GtaLoadingBackground />

      <button
        type="button"
        className="theme-toggle-btn auth-theme-toggle"
        onClick={onToggleTheme}
        title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <SunIcon size={18} /> : <MoonIcon size={18} />}
      </button>

      <div className="auth-page">
        <div className="auth-shell">
          {/* Left Column: Clean & Engaging Hero (Visible on Desktop/Tablet) */}
          <section className="auth-hero">
            <div className="auth-brand-badge">
              <LogoIcon size={16} />
              <span>ExpenseLens</span>
            </div>

            <h1 className="auth-title">
              Track your spending with <span className="gradient-text">clarity</span>.
            </h1>

            <p className="auth-subtitle">
              Simple, powerful personal expense tracking. Categorize your expenses, monitor monthly trends, and take control of your budget.
            </p>

            <div className="auth-highlights">
              <div className="auth-highlight-item">
                <div className="auth-highlight-icon">
                  <ZapIcon size={18} />
                </div>
                <div>
                  <strong>Fast &amp; Simple</strong>
                  <p>Log expenses in seconds with automatic categorization.</p>
                </div>
              </div>

              <div className="auth-highlight-item">
                <div className="auth-highlight-icon">
                  <BarChartIcon size={18} />
                </div>
                <div>
                  <strong>Visual Analytics</strong>
                  <p>Understand where your money goes with clear charts and summaries.</p>
                </div>
              </div>

              <div className="auth-highlight-item">
                <div className="auth-highlight-icon">
                  <ShieldIcon size={18} />
                </div>
                <div>
                  <strong>Private &amp; Secure</strong>
                  <p>Your financial records are protected with secure authentication.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Right Column: Single Compact Frosted Glass Auth Card (Visible on all devices) */}
          <section className="card auth-form-card glow-card">
            {/* Mobile Brand Header */}
            <div className="auth-mobile-header">
              <div className="auth-brand-badge" style={{ marginBottom: "8px" }}>
                <LogoIcon size={15} />
                <span>ExpenseLens</span>
              </div>
              <h2 className="auth-mobile-title">
                Track your spending with <span className="gradient-text">clarity</span>.
              </h2>
            </div>

            <div className="auth-mode-switch">
              <button
                type="button"
                className={`auth-mode-btn ${authMode === "login" ? "active" : ""}`}
                onClick={() => authMode !== "login" && onModeToggle()}
              >
                Log In
              </button>
              <button
                type="button"
                className={`auth-mode-btn ${authMode === "register" ? "active" : ""}`}
                onClick={() => authMode !== "register" && onModeToggle()}
              >
                Sign Up
              </button>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <p className="eyebrow">{authMode === "login" ? "WELCOME BACK" : "CREATE AN ACCOUNT"}</p>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0, color: "var(--text-heading)" }}>
                {authMode === "login" ? "Log in to your account" : "Get started with ExpenseLens"}
              </h3>
            </div>

            <form className="stack-form" onSubmit={onSubmit}>
              {authMode === "register" && (
                <label>
                  <span>Name</span>
                  <input
                    value={authForm.name}
                    onChange={(e) => onAuthFormChange("name", e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </label>
              )}

              <label>
                <span>Email address</span>
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(e) => onAuthFormChange("email", e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </label>

              <label>
                <span>Password</span>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) => onAuthFormChange("password", e.target.value)}
                  placeholder="At least 6 characters"
                  required
                />
              </label>

              {errorMessage && <p className="status error">{errorMessage}</p>}
              {feedback && <p className="status success">{feedback}</p>}

              <button className="primary-button" type="submit" disabled={submittingAuth} style={{ width: "100%", marginTop: "6px" }}>
                {submittingAuth
                  ? "Please wait..."
                  : authMode === "login"
                    ? "Log In"
                    : "Create Account"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
};

export default AuthScreen;
