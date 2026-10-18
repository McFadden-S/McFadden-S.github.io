import { SCENES } from './scenes.js';

const COLS = 90;
const ROWS = 34;
const CW = 8;
const CH = 12;
const TOP = 3;
const PALETTE: Record<string, string> = { a: '#948a7f', b: '#e9e1d3', r: '#ff2a3d', d: '#7a1420', i: '#7ff6ff', h: '#ffd3d7', s: '#4a413d' };
export const ASPECT = `${COLS * CW} / ${(ROWS - TOP) * CH}`;

type Scene = (e: Grid, t: number) => void;

export interface Grid {
  cols: number;
  rows: number;
  ch: string[];
  co: string[];
  clear(): void;
  P(x: number, y: number, s: string | number, c?: string): void;
  F(x: number, y: number, w: number, h: number, c0: string, c?: string): void;
  hl(x: number, y: number, n: number, c0: string, c?: string): void;
  vl(x: number, y: number, n: number, c0: string, c?: string): void;
  box(x: number, y: number, w: number, h: number, c?: string): void;
  bar(x: number, y: number, w: number, f: number, c?: string, c2?: string): void;
  h(n: number): number;
  head(name: string, venue: string): void;
}

function makeGrid(cols: number, rows: number): Grid {
  const ch: string[] = new Array(cols * rows).fill(' ');
  const co: string[] = new Array(cols * rows).fill('a');
  const e: Grid = {
    cols,
    rows,
    ch,
    co,
    clear() {
      ch.fill(' ');
      co.fill('a');
    },
    P(x, y, s, c) {
      x = Math.round(x);
      y = Math.round(y);
      const str = String(s);
      if (y < 0 || y >= rows) return;
      for (let i = 0; i < str.length; i++) {
        const xx = x + i;
        if (xx < 0 || xx >= cols || str[i] === ' ') continue;
        ch[y * cols + xx] = str[i];
        co[y * cols + xx] = c || 'b';
      }
    },
    F(x, y, w, h, c0, c) {
      for (let j = 0; j < h; j++) e.P(x, y + j, c0.repeat(Math.max(0, w)), c);
    },
    hl(x, y, n, c0, c) {
      e.P(x, y, c0.repeat(Math.max(0, Math.round(n))), c);
    },
    vl(x, y, n, c0, c) {
      for (let j = 0; j < n; j++) e.P(x, y + j, c0, c);
    },
    box(x, y, w, h, c) {
      const edge = '+' + '-'.repeat(Math.max(0, w - 2)) + '+';
      e.P(x, y, edge, c);
      e.P(x, y + h - 1, edge, c);
      for (let j = 1; j < h - 1; j++) {
        e.P(x, y + j, '|', c);
        e.P(x + w - 1, y + j, '|', c);
      }
    },
    bar(x, y, w, f, c, c2) {
      const n = Math.round(Math.max(0, Math.min(1, f)) * w);
      e.P(x, y, '#'.repeat(n), c);
      e.P(x + n, y, '-'.repeat(w - n), c2 || 's');
    },
    h(n) {
      const s = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
      return s - Math.floor(s);
    },
    head() {
    },
  };
  return e;
}

export class PaperAnim {
  private ctx: CanvasRenderingContext2D;
  private grid = makeGrid(COLS, ROWS);
  private scene?: Scene;
  private t = 0;
  private last = 0;
  private raf = 0;
  private on = false;
  private visible = true;
  private reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  private w = 1;
  private dpr = 1;

  constructor(private canvas: HTMLCanvasElement, id?: string | null) {
    this.ctx = canvas.getContext('2d')!;
    new ResizeObserver(() => this.resize()).observe(canvas);
    new IntersectionObserver(([en]) => {
      this.visible = en.isIntersecting;
      if (this.visible && this.on) this.loop();
    }).observe(canvas);
    document.addEventListener('visibilitychange', () => this.on && this.loop());
    document.fonts?.load('12px "Departure Mono"').then(() => this.draw(), () => {});
    this.resize();
    if (id) this.set(id);
  }

  set(id: string) {
    const s = (SCENES as Record<string, Scene>)[id];
    if (!s || s === this.scene) return;
    this.scene = s;
    this.t = this.reduced ? 9 : 0;
    this.draw();
  }

  start() {
    this.on = true;
    this.loop();
  }

  stop() {
    this.on = false;
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private loop() {
    if (this.raf || this.reduced) return this.draw();
    const step = (now: number) => {
      this.raf = 0;
      if (!this.on || !this.visible || document.hidden) return;
      this.t += Math.min(0.05, Math.max(0, (now - (this.last || now)) / 1000));
      this.last = now;
      this.draw();
      this.raf = requestAnimationFrame(step);
    };
    this.last = 0;
    this.raf = requestAnimationFrame(step);
  }

  private resize() {
    this.w = Math.max(1, this.canvas.clientWidth);
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    const h = (this.w * (ROWS - TOP) * CH) / (COLS * CW);
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(h * this.dpr);
    this.draw();
  }

  private draw() {
    if (!this.scene) return;
    const e = this.grid, ctx = this.ctx;
    e.clear();
    this.scene(e, this.t);
    const k = (this.w / (COLS * CW)) * this.dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.setTransform(k, 0, 0, k, 0, -TOP * CH * k);
    ctx.font = '12px "Departure Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let colour = '';
    for (let y = TOP; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const i = y * COLS + x, c = e.ch[i];
        if (c === ' ') continue;
        const col = PALETTE[e.co[i]] || PALETTE.b;
        if (col !== colour) {
          ctx.fillStyle = col;
          colour = col;
        }
        ctx.fillText(c, x * CW + CW / 2, y * CH + CH / 2 + 0.5);
      }
    }
  }
}
