import { normalInv } from "./sampling";

export type Period = "day" | "week" | "month";

const Z_POWER_80 = 0.8416;

export function requiredSampleSize(baseline: number, lift: number, confidence: number): number {
  const p1 = baseline;
  const p2 = baseline * (1 + lift);
  const delta = p2 - p1;
  if (delta <= 0 || p2 >= 1 || p1 <= 0) return Infinity;
  const za = normalInv(confidence);
  const numerator = (za + Z_POWER_80) ** 2 * (p1 * (1 - p1) + p2 * (1 - p2));
  return Math.ceil(numerator / (delta * delta));
}

export function estimateDuration(requiredN: number, visitorsPerPeriod: number): number {
  if (!Number.isFinite(requiredN) || visitorsPerPeriod <= 0) return Infinity;
  return Math.ceil((requiredN * 2) / visitorsPerPeriod);
}

export function formatDuration(periods: number, unit: Period): string {
  const label = periods === 1 ? unit : `${unit}s`;
  return `~${periods} ${label}`;
}
