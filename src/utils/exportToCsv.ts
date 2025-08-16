/**
 * Utility function to export objects array as a CSV file and trigger download.
 */

/**
 * exportToCsv
 * @description Function
 */
export function exportToCsv(
  rows: Record<string, string | number | null | undefined>[],
  filename = 'export.',
): void {
  if (!rows || rows.length === 0) {
    return;
  }

  // Extract CSV header
  const headers = Object.keys(rows[0]);
  const escapeValue = (val: unknown): string => {
    if (val == null) return '';
    let s = String(val);
    // Escape quotes by doubling them
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      s = '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => headers.map((h) => escapeValue(row[h])).join(',')),
  ].join('\r\n');

  // Trigger download
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 50);
}
