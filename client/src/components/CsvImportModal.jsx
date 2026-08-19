import { useState, useRef } from "react";
import { formatCurrency } from "../lib/formatters.js";

const CsvImportModal = ({
  isOpen,
  onClose,
  categories = [],
  onBatchImport,
}) => {
  const [parsedRows, setParsedRows] = useState([]);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError("");

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0);
        if (lines.length <= 1) {
          setError("CSV file is empty or missing headers.");
          return;
        }

        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/"/g, ""));
        const merchantIdx = headers.findIndex((h) => h.includes("merchant") || h.includes("desc") || h.includes("name"));
        const amountIdx = headers.findIndex((h) => h.includes("amount") || h.includes("cost") || h.includes("price"));
        const dateIdx = headers.findIndex((h) => h.includes("date") || h.includes("time"));
        const categoryIdx = headers.findIndex((h) => h.includes("category") || h.includes("tag"));
        const notesIdx = headers.findIndex((h) => h.includes("note") || h.includes("memo"));

        if (merchantIdx === -1 || amountIdx === -1) {
          setError("CSV must contain columns for Merchant/Description and Amount.");
          return;
        }

        const defaultCategory = categories[0]?.id || "";

        const rows = lines.slice(1).map((line, idx) => {
          const cells = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
          const merchant = cells[merchantIdx] || `Expense #${idx + 1}`;
          const amount = parseFloat(cells[amountIdx]) || 0;
          const dateStr = dateIdx !== -1 && cells[dateIdx] ? cells[dateIdx] : new Date().toISOString().slice(0, 10);
          const rawCat = categoryIdx !== -1 ? cells[categoryIdx] : "";
          const matchedCat = categories.find((c) => c.name.toLowerCase() === rawCat.toLowerCase())?.id || defaultCategory;
          const notes = notesIdx !== -1 ? cells[notesIdx] : "";

          return {
            id: `row-${idx}`,
            merchant,
            amount,
            expenseDate: dateStr.length >= 10 ? dateStr.slice(0, 10) : new Date().toISOString().slice(0, 10),
            categoryId: matchedCat,
            notes,
          };
        }).filter((r) => r.amount > 0);

        if (rows.length === 0) {
          setError("No valid positive expense amounts found in this file.");
          return;
        }

        setParsedRows(rows);
      } catch (err) {
        setError("Failed to parse CSV file. Please verify formatting.");
      }
    };

    reader.readAsText(file);
  };

  const handleImportSubmit = async () => {
    if (parsedRows.length === 0) return;
    setImporting(true);
    try {
      await onBatchImport(parsedRows);
      onClose();
    } catch (err) {
      setError("Failed to import some rows. Please retry.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "680px" }}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="card-header-icon" style={{ width: "36px", height: "36px" }}>
              📥
            </div>
            <div>
              <p className="eyebrow" style={{ margin: 0 }}>BATCH IMPORT</p>
              <h3 style={{ margin: 0, fontSize: "1.15rem", color: "var(--text-heading)" }}>Import CSV Statement</h3>
            </div>
          </div>
          <button type="button" className="ghost-button" onClick={onClose} style={{ padding: "4px 8px" }}>
            ✕
          </button>
        </div>

        {/* Drag & Drop Dropzone */}
        {parsedRows.length === 0 ? (
          <div
            className="import-dropzone"
            onClick={() => fileInputRef.current?.click()}
          >
            <span style={{ fontSize: "2.5rem" }}>📄</span>
            <strong>Click or Drag &amp; Drop a CSV Statement</strong>
            <p>Supports bank, credit card, and ExpenseLens CSV exports</p>
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            {error && <p className="status error" style={{ marginTop: "12px" }}>{error}</p>}
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div>
                <strong>{fileName}</strong>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Parsed {parsedRows.length} valid transactions
                </p>
              </div>
              <button
                type="button"
                className="ghost-button"
                onClick={() => {
                  setParsedRows([]);
                  setFileName("");
                }}
                style={{ fontSize: "0.8rem" }}
              >
                Choose another file
              </button>
            </div>

            {/* Preview table */}
            <div className="table-wrap" style={{ maxHeight: "250px", overflowY: "auto", border: "1px solid var(--border-subtle)", borderRadius: "var(--r-md)" }}>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Merchant</th>
                    <th>Amount</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.slice(0, 10).map((row) => (
                    <tr key={row.id}>
                      <td className="date-cell">{row.expenseDate}</td>
                      <td>{row.merchant}</td>
                      <td className="amount-cell">{formatCurrency(row.amount)}</td>
                      <td>
                        {categories.find((c) => String(c.id) === String(row.categoryId))?.name || "General"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {parsedRows.length > 10 && (
              <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "6px" }}>
                + {parsedRows.length - 10} more rows ready for import
              </p>
            )}

            <div className="button-row" style={{ marginTop: "18px" }}>
              <button
                type="button"
                className="primary-button"
                onClick={handleImportSubmit}
                disabled={importing}
                style={{ flex: 1 }}
              >
                {importing ? "Importing transactions..." : `Import ${parsedRows.length} Transactions`}
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={onClose}
                disabled={importing}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CsvImportModal;
