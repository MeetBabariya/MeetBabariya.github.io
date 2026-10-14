/** Minimal SVG line chart shared by the interactive case-study figures.
 *  Draws axes, gridlines, series and a hover readout. No dependencies. */

export interface Series {
  y: number[];
  label: string;
  className: string; // styles live in the component (stroke colour, width)
}

export interface ChartSpec {
  x: number[];
  series: Series[];
  yMin?: number;
  yMax?: number;
  xLabel?: string;
  yUnit?: string;
  hline?: { y: number; label: string };
}

const W = 720, H = 320, L = 50, R = 14, T = 14, B = 38;
const NS = 'http://www.w3.org/2000/svg';

function niceTicks(lo: number, hi: number, n = 5): number[] {
  const span = hi - lo || 1;
  const step0 = span / n;
  const mag = 10 ** Math.floor(Math.log10(step0));
  const step = [1, 2, 5, 10].map((m) => m * mag).find((s) => span / s <= n) ?? step0;
  const out: number[] = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) out.push(+v.toFixed(6));
  return out;
}

const el = (tag: string, attrs: Record<string, string | number>) => {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  return e;
};

export function drawChart(svg: SVGSVGElement, spec: ChartSpec, readout?: HTMLElement) {
  const ys = spec.series.flatMap((s) => s.y);
  const yMin = spec.yMin ?? Math.floor(Math.min(...ys) / 5) * 5;
  const yMax = spec.yMax ?? Math.ceil(Math.max(...ys) / 5) * 5;
  const xMin = spec.x[0], xMax = spec.x[spec.x.length - 1];
  const sx = (v: number) => L + ((v - xMin) / (xMax - xMin || 1)) * (W - L - R);
  const sy = (v: number) => T + (1 - (Math.min(Math.max(v, yMin), yMax) - yMin) / (yMax - yMin || 1)) * (H - T - B);

  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.replaceChildren();
  for (const v of niceTicks(yMin, yMax)) {
    svg.append(el('line', { x1: L, x2: W - R, y1: sy(v), y2: sy(v), class: 'grid' }));
    const t = el('text', { x: L - 8, y: sy(v) + 4, class: 'tick', 'text-anchor': 'end' });
    t.textContent = `${v}`;
    svg.append(t);
  }
  const labelRoom = spec.xLabel ? spec.xLabel.length * 6.6 + 16 : 0; // keep the axis title clear of tick labels
  for (const v of niceTicks(xMin, xMax, 6)) {
    if (sx(v) > W - R - labelRoom) continue;
    const t = el('text', { x: sx(v), y: H - 12, class: 'tick', 'text-anchor': 'middle' });
    t.textContent = `${v}`;
    svg.append(t);
  }
  if (spec.xLabel) {
    const t = el('text', { x: W - R, y: H - 12, class: 'tick', 'text-anchor': 'end' });
    t.textContent = spec.xLabel;
    svg.append(t);
  }
  if (spec.hline && spec.hline.y > yMin && spec.hline.y < yMax) {
    svg.append(el('line', { x1: L, x2: W - R, y1: sy(spec.hline.y), y2: sy(spec.hline.y), class: 'hline' }));
    const t = el('text', { x: W - R, y: sy(spec.hline.y) - 6, class: 'tick hline-label', 'text-anchor': 'end' });
    t.textContent = spec.hline.label;
    svg.append(t);
  }
  for (const s of spec.series) {
    const d = s.y.map((v, i) => `${i ? 'L' : 'M'}${sx(spec.x[i]).toFixed(1)} ${sy(v).toFixed(1)}`).join('');
    svg.append(el('path', { d, class: `line ${s.className}`, fill: 'none' }));
  }
  const cross = el('line', { x1: 0, x2: 0, y1: T, y2: H - B, class: 'cross' });
  const hit = el('rect', { x: L, y: T, width: W - L - R, height: H - T - B, fill: 'transparent' });
  svg.append(cross, hit);

  const unit = spec.yUnit ?? '';
  const write = (i: number) => {
    if (!readout) return;
    readout.innerHTML =
      `<span>t = ${spec.x[i].toFixed(1)} min</span>` +
      spec.series.map((s) => `<span><i class="sw ${s.className}"></i>${s.label} <b>${s.y[i].toFixed(1)}${unit}</b></span>`).join('');
  };
  const last = spec.x.length - 1;
  write(last);
  hit.addEventListener('pointermove', (e) => {
    const pt = new DOMPoint((e as PointerEvent).clientX, (e as PointerEvent).clientY).matrixTransform(svg.getScreenCTM()!.inverse());
    const frac = (pt.x - L) / (W - L - R);
    const i = Math.max(0, Math.min(last, Math.round(frac * last)));
    cross.setAttribute('x1', String(sx(spec.x[i])));
    cross.setAttribute('x2', String(sx(spec.x[i])));
    cross.classList.add('on');
    write(i);
  });
  hit.addEventListener('pointerleave', () => { cross.classList.remove('on'); write(last); });
}

const cache = new Map<string, Promise<any>>();
export function loadJSON<T = any>(url: string): Promise<T> {
  if (!cache.has(url)) cache.set(url, fetch(url).then((r) => r.json()));
  return cache.get(url)!;
}
