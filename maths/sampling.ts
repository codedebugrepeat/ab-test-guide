export function drawSample(n: number, p: number): boolean[] {
  return Array.from({ length: n }, () => Math.random() < p);
}

export function drawCount(n: number, p: number): number {
  return drawSample(n, p).filter(x => x === true).length;
}

export function binomialMean(n: number, p: number): number {
  return n * p;
}

export function binomialSD(n: number, p: number): number {
  return Math.sqrt(n * p * (1 - p));
}
