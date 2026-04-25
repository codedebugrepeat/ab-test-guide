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
