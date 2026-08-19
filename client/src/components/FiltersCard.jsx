import { useRef } from "react";
import { SearchIcon } from "./Icons.jsx";

const FiltersCard = ({
  categories,
  filters,
  loading,
  monthOptions,
  onChange,
  onReset,
  onSubmit,
}) => {
  const searchInputRef = useRef(null);

  const currentMonthStr = new Date().toISOString().slice(0, 7);

  const handleTimeframeSelect = (timeframe) => {
    if (timeframe === "all") {
      onChange("month", "");
    } else if (timeframe === "current") {
      onChange("month", currentMonthStr);
    }
  };

  return (
    <article className="card">
      <div className="card-header">
        <div className="card-header-content">
          <div className="card-header-icon">
            <SearchIcon size={20} />
          </div>
          <div>
            <p className="eyebrow">FILTER RECORDS</p>
            <h2>Filter &amp; Search</h2>
          </div>
        </div>
      </div>

      {/* Segmented Quick Timeframe Control */}
      <div className="segmented-timeframe-bar">
        <button
          type="button"
          className={`segmented-pill-btn ${!filters.month ? "active" : ""}`}
          onClick={() => handleTimeframeSelect("all")}
        >
          All Time
        </button>
        <button
          type="button"
          className={`segmented-pill-btn ${filters.month === currentMonthStr ? "active" : ""}`}
          onClick={() => handleTimeframeSelect("current")}
        >
          This Month
        </button>
      </div>

      <form className="stack-form" onSubmit={onSubmit} style={{ marginTop: "14px" }}>
        <label>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Search</span>
            <kbd className="kbd-shortcut-badge">Press /</kbd>
          </div>
          <input
            ref={searchInputRef}
            value={filters.search}
            onChange={(e) => onChange("search", e.target.value)}
            placeholder="Search by merchant, notes..."
          />
        </label>

        <label>
          <span>Category</span>
          <select
            value={filters.categoryId}
            onChange={(e) => onChange("categoryId", e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Month</span>
          <select
            value={filters.month}
            onChange={(e) => onChange("month", e.target.value)}
          >
            <option value="">All Time</option>
            {monthOptions.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </label>

        <div className="button-row" style={{ marginTop: "4px" }}>
          <button className="primary-button" type="submit" disabled={loading} style={{ flex: 1 }}>
            {loading ? "Filtering..." : "Apply Filters"}
          </button>
          <button
            className="secondary-button"
            type="button"
            onClick={onReset}
            disabled={loading}
          >
            Reset
          </button>
        </div>
      </form>
    </article>
  );
};

export default FiltersCard;
