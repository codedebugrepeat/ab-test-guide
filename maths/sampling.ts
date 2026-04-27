export function drawSample(n: number, p: number): boolean[] {
  return Array.from({ length: n }, () => Math.random() < p);
}

export function countSample(marbles: boolean[]): number {
  return marbles.filter(x => x === true).length;
}


export function binomialMean(n: number, p: number): number {
  return n * p;
}

export function binomialSD(n: number, p: number): number {
  return Math.sqrt(n * p * (1 - p));
}

export function sampleMean(counts: number[]): number {
  if (counts.length === 0) return 0;
  return counts.reduce((a, b) => a + b, 0) / counts.length;
}

// Binomial PMF via recurrence to avoid huge binomial coefficients.
// Returns raw float probability mass per integer-percent bin.
// Outcomes that map to a bin > maxBin are dropped (truncated), so the values
// may sum to less than 1; callers that need a fixed total must renormalize.
export function binomialPMF(n: number, p: number, maxBin: number): number[] {
  const raw = new Array<number>(maxBin + 1).fill(0);
  if (n <= 0) { raw[0] = 1; return raw; }
  if (p <= 0) { raw[0] = 1; return raw; }
  if (p >= 1) { raw[maxBin] = 1; return raw; }

  let prob = Math.pow(1 - p, n);
  for (let k = 0; k <= n; k += 1) {
    const bin = Math.round((k / n) * 100);
    if (bin <= maxBin) raw[bin] += prob;
    if (k < n) {
      prob = (prob * (n - k)) / (k + 1);
      prob = (prob * p) / (1 - p);
    }
  }
  return raw;
}

export type GaussianPoint = { x: number; y: number };

// Standard-normal curve in z-score (SD) units: x=0 is the mean, x=±1 is ±1 SD.
// y is normalized to peak=1. Use when the axis should show SD distances rather
// than raw measurement units (e.g. the ruler-teaching widget in chapter 3).
export function standardNormalCurve(xMin: number, xMax: number, steps = 300): GaussianPoint[] {
  return Array.from({ length: steps }, (_, i) => {
    const x = xMin + (i / (steps - 1)) * (xMax - xMin);
    return { x, y: Math.exp(-0.5 * x * x) };
  });
}

// Continuous normal-curve samples for the binomial Bin(n, p), normalized to
// peak=1, evaluated at `steps` evenly-spaced x-values over [xMin, xMax]
// (where x is in percentage-point units, i.e. p*100). Used for smooth bell
// silhouettes; the binomial PMF at small p is too coarse to render well.
export function gaussianCurve(
  p: number,
  n: number,
  xMin: number,
  xMax: number,
  steps = 300,
): GaussianPoint[] {
  const mean = p * 100;
  const sd = Math.sqrt(n * p * (1 - p));
  if (sd < 1e-6) return [{ x: mean, y: 1 }];
  return Array.from({ length: steps }, (_, i) => {
    const x = xMin + (i / (steps - 1)) * (xMax - xMin);
    const z = (x - mean) / sd;
    return { x, y: Math.exp(-0.5 * z * z) };
  });
}

// One-sided z-score lookup for the confidence levels the guide uses.
export const Z_BY_CONFIDENCE: Record<number, number> = {
  0.8: 0.8416,
  0.9: 1.2816,
  0.95: 1.6449,
  0.99: 2.3263,
};

function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const y =
    1 -
    (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t +
      0.254829592) *
      t *
      Math.exp(-ax * ax));
  return sign * y;
}

export function normalCdf(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

export function buildTheoreticalBuckets({
  n,
  p,
  maxBin,
  totalDots,
}: {
  n: number;
  p: number;
  maxBin: number;
  totalDots: number;
}): number[] {
  const buckets = Array.from({ length: maxBin + 1 }, () => 0);
  if (p <= 0) {
    buckets[0] = totalDots;
    return buckets;
  }
  if (p >= 1) {
    buckets[maxBin] = totalDots;
    return buckets;
  }

  // We first compute raw weights per visible bin, then renormalize to exactly
  // totalDots using a largest-remainder method. This gives stable visual density
  // regardless of how much probability mass falls outside maxBin.
  const raw = binomialPMF(n, p, maxBin);

  const visibleMass = raw.reduce((acc, v) => acc + v, 0);
  if (visibleMass <= 0) {
    buckets[Math.min(maxBin, Math.max(0, Math.round(p * 100)))] = totalDots;
    return buckets;
  }

  // Renormalize against visibleMass so buckets always sum to exactly totalDots.
  const scaled = raw.map((v) => (v / visibleMass) * totalDots);
  const floored = scaled.map((v) => Math.floor(v));
  let remaining = totalDots - floored.reduce((acc, v) => acc + v, 0);

  const remainders = scaled
    .map((v, idx) => ({ idx, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);

  for (let i = 0; i < remainders.length && remaining > 0; i += 1) {
    floored[remainders[i].idx] += 1;
    remaining -= 1;
  }

  for (let i = 0; i < buckets.length; i += 1) {
    buckets[i] = floored[i];
  }

  return buckets;
}
