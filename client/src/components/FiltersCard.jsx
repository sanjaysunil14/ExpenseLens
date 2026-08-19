const FiltersCard = ({
  categories,
  filters,
  loading,
  monthOptions,
  onChange,
  onReset,
  onSubmit,
}) => (
  <article className="card filters-card">
    <div className="card-header">
      <div>
        <p className="eyebrow">Filters</p>
        <h2>Refine your view</h2>
      </div>
    </div>

    <form className="stack-form" onSubmit={onSubmit}>
      <label>
        <span>Search</span>
        <input
          value={filters.search}
          onChange={(event) => onChange("search", event.target.value)}
          placeholder="Search merchant or notes"
        />
      </label>

      <label>
        <span>Category</span>
        <select
          value={filters.categoryId}
          onChange={(event) => onChange("categoryId", event.target.value)}
        >
          <option value="">All categories</option>
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
          onChange={(event) => onChange("month", event.target.value)}
        >
          <option value="">All months</option>
          {monthOptions.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </label>

      <div className="button-row">
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Filtering..." : "Apply filters"}
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

export default FiltersCard;
