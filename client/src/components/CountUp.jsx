import { useEffect, useState } from "react";
import { formatCurrency } from "../lib/formatters.js";

const CountUp = ({ end = 0, duration = 600, isCurrency = true }) => {
  const [displayValue, setDisplayValue] = useState(end);

  useEffect(() => {
    let startTimestamp = null;
    const startVal = displayValue;
    const endVal = Number(end) || 0;

    if (startVal === endVal) return;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (endVal - startVal) * easeProgress;

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayValue(endVal);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [end, duration]);

  if (isCurrency) {
    return <span>{formatCurrency(displayValue)}</span>;
  }

  return <span>{Math.round(displayValue)}</span>;
};

export default CountUp;
