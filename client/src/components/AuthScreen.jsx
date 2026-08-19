const AuthScreen = ({
  authForm,
  authMode,
  errorMessage,
  feedback,
  onAuthFormChange,
  onModeToggle,
  onSubmit,
  submittingAuth,
}) => (
  <div className="page-shell auth-shell">
    <section className="hero-panel">
      <p className="eyebrow">ExpenseLens</p>
      <h1>See where your money actually goes.</h1>
      <p className="hero-copy">
        Track expenses, filter spending, and review category and monthly totals
        in one clean dashboard.
      </p>
      <div className="hero-stats">
        <div>
          <strong>Auth</strong>
          <span>Register and log in securely</span>
        </div>
        <div>
          <strong>CRUD</strong>
          <span>Add, edit, and delete expenses</span>
        </div>
        <div>
          <strong>Insights</strong>
          <span>Totals by category and month</span>
        </div>
      </div>
    </section>

    <section className="card auth-card">
      <div className="card-header">
        <div>
          <p className="eyebrow">
            {authMode === "login" ? "Welcome back" : "Create account"}
          </p>
          <h2>{authMode === "login" ? "Log in" : "Start using ExpenseLens"}</h2>
        </div>
        <button type="button" className="ghost-button" onClick={onModeToggle}>
          {authMode === "login" ? "Need an account?" : "Already have one?"}
        </button>
      </div>

      <form className="stack-form" onSubmit={onSubmit}>
        {authMode === "register" && (
          <label>
            <span>Name</span>
            <input
              value={authForm.name}
              onChange={(event) => onAuthFormChange("name", event.target.value)}
              placeholder="Sanjay"
              required
            />
          </label>
        )}

        <label>
          <span>Email</span>
          <input
            type="email"
            value={authForm.email}
            onChange={(event) => onAuthFormChange("email", event.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>

        <label>
          <span>Password</span>
          <input
            type="password"
            value={authForm.password}
            onChange={(event) => onAuthFormChange("password", event.target.value)}
            placeholder="At least 6 characters"
            required
          />
        </label>

        {errorMessage && <p className="status error">{errorMessage}</p>}
        {feedback && <p className="status success">{feedback}</p>}

        <button className="primary-button" type="submit" disabled={submittingAuth}>
          {submittingAuth
            ? "Please wait..."
            : authMode === "login"
              ? "Log in"
              : "Create account"}
        </button>
      </form>
    </section>
  </div>
);

export default AuthScreen;
