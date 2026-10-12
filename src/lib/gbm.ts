/** Seeded geometric-Brownian-motion fan, shared by server render and client resample. */

export interface Fan {
  paths: number[][];
  bands: { p5: number[]; p25: number[]; p50: number[]; p75: number[]; p95: number[] };
  steps: number;
}

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function simulate({ n = 96, steps = 120, s0 = 100, mu = 0.06, sigma = 0.22, seed = 7 } = {}): Fan {
  const rand = mulberry32(seed);
  const gauss = () => {
    let u = 0;
    while (u === 0) u = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
  };
  const dt = 1 / steps;
  const drift = (mu - 0.5 * sigma * sigma) * dt;
  const vol = sigma * Math.sqrt(dt);
  const paths: number[][] = [];
  for (let i = 0; i < n; i++) {
    const p = [s0];
    for (let t = 1; t <= steps; t++) p.push(p[t - 1] * Math.exp(drift + vol * gauss()));
    paths.push(p);
  }
  const q = (sorted: number[], f: number) => sorted[Math.min(sorted.length - 1, Math.round(f * (sorted.length - 1)))];
  const bands = { p5: [] as number[], p25: [] as number[], p50: [] as number[], p75: [] as number[], p95: [] as number[] };
  for (let t = 0; t <= steps; t++) {
    const col = paths.map((p) => p[t]).sort((a, b) => a - b);
    bands.p5.push(q(col, 0.05));
    bands.p25.push(q(col, 0.25));
    bands.p50.push(q(col, 0.5));
    bands.p75.push(q(col, 0.75));
    bands.p95.push(q(col, 0.95));
  }
  return { paths, bands, steps };
}

export const FAN_BOX = { w: 600, h: 360, l: 44, r: 16, t: 16, b: 32, ymin: 55, ymax: 175 };

export function sx(i: number, steps: number) {
  const { w, l, r } = FAN_BOX;
  return l + (i / steps) * (w - l - r);
}
export function sy(v: number) {
  const { h, t, b, ymin, ymax } = FAN_BOX;
  const c = Math.max(ymin, Math.min(ymax, v));
  return t + (1 - (c - ymin) / (ymax - ymin)) * (h - t - b);
}
export const line = (ys: number[], steps: number) =>
  ys.map((v, i) => `${i ? 'L' : 'M'}${sx(i, steps).toFixed(1)} ${sy(v).toFixed(1)}`).join('');
export const area = (lo: number[], hi: number[], steps: number) =>
  line(hi, steps) + lo.map((v, i) => [i, v] as const).reverse().map(([i, v]) => `L${sx(i, steps).toFixed(1)} ${sy(v).toFixed(1)}`).join('') + 'Z';
