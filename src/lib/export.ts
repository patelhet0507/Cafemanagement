export function downloadCSV(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export function printElement(id: string) {
  const el = document.getElementById(id);
  if (!el) return window.print();
  const w = window.open("", "_blank");
  if (!w) return window.print();
  w.document.write(`<html><head><title>Print</title><style>body{font-family:system-ui;padding:24px} table{width:100%;border-collapse:collapse} th,td{border:1px solid #ddd;padding:8px;text-align:left}</style></head><body>${el.innerHTML}</body></html>`);
  w.document.close(); w.print();
}
