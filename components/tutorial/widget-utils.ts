/**
 * Returns the most recent `maxRows` items from `rows`, ordered newest-first.
 * Rows are assumed to be in generation order (oldest index 0, newest last).
 */
export function newestFirst<T>(rows: T[], maxRows: number): T[] {
  if (maxRows <= 0) return [];
  return rows.slice(-maxRows).reverse();
}
