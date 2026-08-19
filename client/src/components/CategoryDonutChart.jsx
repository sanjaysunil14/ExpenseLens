import { useState, useMemo } from "react";
import { formatCurrency } from "../lib/formatters.js";
import { getCategoryTheme } from "../lib/categoryColors.js";

const CategoryDonutChart = ({ byCategory = [], totalAmount = 0, onSelectCategory }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const size = 200;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const total = totalAmount || byCategory.reduce((sum, c) => sum + Number(c.totalAmount || 0), 0) || 1;

  const segments = useMemo(() => {
    let accumulatedOffset = 0;

    return byCategory.map((cat) => {
      const amount = Number(cat.totalAmount || 0);
      const percentage = amount / total;
      const strokeDasharray = `${percentage * circumference} ${circumference}`;
      const strokeDashoffset = -accumulatedOffset * circumference;
      const theme = getCategoryTheme(cat.categoryName);

      accumulatedOffset += percentage;

      return {
        ...cat,
        amount,
        percentage: (percentage * 100).toFixed(1),
        strokeDasharray,
        strokeDashoffset,
        theme,
      };
    });
  }, [byCategory, total, circumference]);

  const activeCategory = hoveredCategory || segments[0];

  if (byCategory.length === 0) {
    return (
      <div className="donut-empty-wrap">
        <svg width={size} height={size}>
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth={strokeWidth}
          />
        </svg>
        <div className="donut-center-text">
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>No Data</span>
        </div>
      </div>
    );
  }

  return (
    <div className="donut-container">
      <div className="donut-svg-wrap">
        <svg width={size} height={size} className="donut-svg" transform="rotate(-90)">
          {/* Background Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--bg-elevated)"
            strokeWidth={strokeWidth}
          />

          {/* Slices */}
          {segments.map((seg) => {
            const isHovered = hoveredCategory?.categoryName === seg.categoryName;
            return (
              <circle
                key={seg.categoryName}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={seg.theme.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                strokeLinecap="round"
                className="donut-slice"
                style={{
                  cursor: "pointer",
                  transition: "stroke-width 0.2s ease, filter 0.2s ease",
                  filter: isHovered ? `drop-shadow(0 0 8px ${seg.theme.color})` : "none",
                }}
                onMouseEnter={() => setHoveredCategory(seg)}
                onMouseLeave={() => setHoveredCategory(null)}
                onClick={() => onSelectCategory && onSelectCategory(seg.categoryId || seg.categoryName)}
              />
            );
          })}
        </svg>

        {/* Center Hover Stats */}
        <div className="donut-center-text">
          <span className="donut-center-label">
            {activeCategory?.theme?.icon} {activeCategory?.categoryName || "Total"}
          </span>
          <strong className="donut-center-amount">
            {formatCurrency(activeCategory ? activeCategory.amount : totalAmount)}
          </strong>
          {activeCategory && (
            <span className="donut-center-pct">
              {activeCategory.percentage}% of total
            </span>
          )}
        </div>
      </div>

      {/* Mini Legend Chips */}
      <div className="donut-legend">
        {segments.slice(0, 5).map((seg) => (
          <button
            type="button"
            key={seg.categoryName}
            className={`donut-legend-item ${hoveredCategory?.categoryName === seg.categoryName ? "active" : ""}`}
            onMouseEnter={() => setHoveredCategory(seg)}
            onMouseLeave={() => setHoveredCategory(null)}
            onClick={() => onSelectCategory && onSelectCategory(seg.categoryId || seg.categoryName)}
          >
            <span className="donut-legend-dot" style={{ background: seg.theme.color }} />
            <span className="donut-legend-name">{seg.categoryName}</span>
            <span className="donut-legend-val">{seg.percentage}%</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryDonutChart;
