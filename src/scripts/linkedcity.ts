export interface CityNode {
  id: string;
  label: string;
  sub: string;
  href: string;
  title?: string;
  topic?: string;
  degree: number;
}

export interface CityOptions {
  canvas: HTMLCanvasElement;
  labels: HTMLElement;
  nodes: CityNode[];
  links: [string, string][];
  onHover?: (id: string | null) => void;
}

interface Tower {
  node: CityNode;
  x: number;
  z: number;
  h: number;
  w: number;
  d: number;
  tip: [number, number] | null;
  bbox: [number, number, number, number] | null;
  label: HTMLAnchorElement & { size?: [number, number] };
}

interface Block {
  x0: number;
  x1: number;
  z0: number;
  z1: number;
  h: number;
  d: number;
}

type Pt = [number, number, number];

const POSITIONS: Record<string, [number, number]> = {
  tesseract: [-20, 10], rpal: [-33, 1], alpoison: [-8, -1], drmd: [-6, 19], replicant: [-19, 30],
  sok: [22, -8], acdenv: [35, -17], wendigo: [11, -21],
  onepic: [25, 18], 'onepic-short': [37, 27],
  direction: [-10, -28],
};
const DISTRICTS: Record<string, [number, number]> = { malware: [-20, 12], drl: [22, -14], rag: [30, 22], vuln: [-10, -28] };

const RAMP = ' .:-=+*#%@';
const HEX = '0123456789ABCDEF';
const TIERS = ['#3a0a12', '#68111e', '#a0172a', '#e0263b'];
const CITY = 150;
const hash = (n: number) => {
  const s = Math.sin(n) * 43758.5453;
  return s - Math.floor(s);
};

export class LinkedCity {
  private ctx: CanvasRenderingContext2D;
  private W = 1;
  private H = 1;
  private dpr = 1;
  private t = 0;
  private last = 0;
  private yaw = 0.75;
  private hot: string | null = null;
  private related = new Set<string>();
  private drag: { x: number; yaw: number; moved: boolean } | null = null;
  private visible = true;
  private running = false;
  private reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  private towers: Tower[] = [];
  private blocks: Block[] = [];
  private cam!: { px: number; py: number; pz: number; fx: number; fy: number; fz: number; rx: number; rz: number; ux: number; uy: number; uz: number; focal: number; cx: number; cy: number };
  private cell: [number, number] = [6, 10];
  private buf?: HTMLCanvasElement;
  private bctx?: CanvasRenderingContext2D;
  private atlas?: HTMLCanvasElement;
  private aw = 1;
  private ah = 1;

  constructor(private o: CityOptions) {
    this.ctx = o.canvas.getContext('2d')!;
    this.layout();
    this.makeLabels();
    this.bind();
    this.resize();
    new ResizeObserver(() => this.resize()).observe(o.canvas);
    new IntersectionObserver(([e]) => {
      this.visible = e.isIntersecting;
      this.kick();
    }).observe(o.canvas);
    document.addEventListener('visibilitychange', () => this.kick());
    document.fonts?.load('12px "Departure Mono"').then(
      () => {
        this.atlas = undefined;
        this.towers.forEach((t) => (t.label.size = undefined));
        this.kick();
      },
      () => {},
    );
    this.kick();
  }

  private layout() {
    const placed: [number, number][] = [];
    for (const node of this.o.nodes) {
      let p = POSITIONS[node.id];
      if (!p) {
        const c = DISTRICTS[node.topic ?? ''] ?? [0, 0];
        let best: [number, number] = c;
        let bd = Infinity;
        for (let x = -50; x <= 50; x += 2) {
          for (let z = -50; z <= 50; z += 2) {
            if (Math.hypot(x, z) > 48 || placed.some((q) => Math.hypot(q[0] - x, q[1] - z) < 11)) continue;
            const d = Math.hypot(x - c[0], z - c[1]);
            if (d < bd) {
              bd = d;
              best = [x, z];
            }
          }
        }
        p = best;
      }
      placed.push(p);
      this.towers.push({ node, x: p[0], z: p[1], h: 7 + node.degree * 1.6, w: 2.2, d: 0, tip: null, bbox: null, label: document.createElement('a') });
    }
    let s = 11;
    const rnd = () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
    const span = Math.floor(CITY / 6) * 6;
    for (let gx = -span; gx <= span; gx += 6) {
      for (let gz = -span; gz <= span; gz += 6) {
        const r = Math.hypot(gx, gz);
        if (r > CITY) continue;
        if (this.towers.some((t) => Math.abs(t.x - gx) < 5.5 && Math.abs(t.z - gz) < 5.5)) continue;
        if (rnd() < 0.12) continue;
        const w = 1.2 + rnd() * 1.1, d = 1.2 + rnd() * 1.1;
        const ox = (rnd() - 0.5) * 1.2, oz = (rnd() - 0.5) * 1.2;
        let h = 1.2 + Math.pow(rnd(), 2.2) * 12 * (0.45 + Math.max(0, 1 - r / 62));
        if (r > 62 && rnd() < 0.07) h = 16 + rnd() * 26;
        this.blocks.push({ x0: gx + ox - w, x1: gx + ox + w, z0: gz + oz - d, z1: gz + oz + d, h, d: 0 });
      }
    }
  }

  private makeLabels() {
    for (const t of this.towers) {
      const a = t.label;
      a.className = 'cy-node';
      a.href = t.node.href;
      a.dataset.node = t.node.id;
      if (t.node.title) a.setAttribute('aria-label', `${t.node.title}, ${t.node.sub}`);
      const name = document.createElement('span');
      name.className = 'cy-node__label';
      name.textContent = t.node.label;
      const sub = document.createElement('span');
      sub.className = 'cy-node__sub';
      sub.textContent = t.node.sub;
      a.append(name, sub);
      a.addEventListener('mouseenter', () => this.setHot(t.node.id));
      a.addEventListener('mouseleave', () => this.setHot(null));
      a.addEventListener('focus', () => this.setHot(t.node.id));
      a.addEventListener('blur', () => this.setHot(null));
      this.o.labels.appendChild(a);
    }
  }

  private bind() {
    const cv = this.o.canvas;
    const point = (e: PointerEvent): [number, number] => {
      const r = cv.getBoundingClientRect();
      return [(e.clientX - r.left) * (this.W / r.width), (e.clientY - r.top) * (this.H / r.height)];
    };
    cv.addEventListener('pointerdown', (e) => {
      this.drag = { x: e.clientX, yaw: this.yaw, moved: false };
      cv.setPointerCapture(e.pointerId);
    });
    cv.addEventListener('pointermove', (e) => {
      if (this.drag) {
        const dx = e.clientX - this.drag.x;
        if (Math.abs(dx) > 3) this.drag.moved = true;
        this.yaw = this.drag.yaw - dx * (this.W / cv.getBoundingClientRect().width) * 0.006;
        cv.style.cursor = 'grabbing';
        this.kick();
        return;
      }
      const p = point(e);
      this.setHot(this.pick(p[0], p[1]));
    });
    cv.addEventListener('pointerup', (e) => {
      const tap = this.drag && !this.drag.moved;
      this.drag = null;
      if (cv.hasPointerCapture(e.pointerId)) cv.releasePointerCapture(e.pointerId);
      const p = point(e);
      const id = tap ? this.pick(p[0], p[1]) : null;
      const t = id ? this.towers.find((x) => x.node.id === id) : undefined;
      if (t) window.location.href = t.node.href;
      cv.style.cursor = this.hot ? 'pointer' : 'grab';
    });
    cv.addEventListener('pointerleave', () => {
      if (!this.drag) this.setHot(null);
    });
  }

  private setHot(id: string | null) {
    if (id === this.hot) return;
    this.hot = id;
    this.related = new Set(id ? this.o.links.flatMap(([a, b]) => (a === id ? [b] : b === id ? [a] : [])) : []);
    for (const t of this.towers) {
      const tid = t.node.id;
      t.label.classList.toggle('is-hot', tid === id);
      t.label.classList.toggle('is-rel', !!id && this.related.has(tid));
      t.label.classList.toggle('is-dim', !!id && tid !== id && !this.related.has(tid));
    }
    if (!this.drag) this.o.canvas.style.cursor = id ? 'pointer' : 'grab';
    this.o.onHover?.(id);
    this.kick();
  }

  private pick(mx: number, my: number) {
    let best: Tower | null = null;
    for (const t of this.towers) {
      const b = t.bbox;
      if (!b || mx < b[0] - 4 || mx > b[2] + 4 || my < b[1] - 4 || my > b[3] + 4) continue;
      if (!best || t.d < best.d) best = t;
    }
    return best ? best.node.id : null;
  }

  private resize() {
    const cv = this.o.canvas;
    this.W = Math.max(1, cv.clientWidth);
    this.H = Math.max(1, cv.clientHeight);
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(this.W * this.dpr);
    cv.height = Math.round(this.H * this.dpr);
    const cw = Math.max(6, this.W / 320);
    this.cell = [cw, (cw * 10) / 6];
    this.atlas = undefined;
    this.kick();
  }

  private kick() {
    if (this.running) return;
    this.running = true;
    requestAnimationFrame(this.frame);
  }

  private frame = (now: number) => {
    this.running = false;
    if (!this.visible || document.hidden) return;
    const dt = Math.min(0.05, Math.max(0, (now - (this.last || now)) / 1000));
    this.last = now;
    if (!this.reduced) {
      this.t += dt;
      if (!this.drag && !this.hot) this.yaw += dt * 0.05;
    }
    this.camera();
    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, this.W, this.H);
    this.drawAscii(ctx);
    const g = ctx.createLinearGradient(0, 0, this.W * 0.5, 0);
    g.addColorStop(0, 'rgba(17,17,17,0.88)');
    g.addColorStop(1, 'rgba(17,17,17,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, this.W * 0.5, this.H);
    this.drawTowers(ctx);
    this.drawLinks(ctx);
    this.placeLabels(ctx);
    if (!this.reduced) this.kick();
    else this.last = 0;
  };

  private camera() {
    const R = 118, py = 64, yaw = this.yaw;
    const px = Math.cos(yaw) * R, pz = Math.sin(yaw) * R;
    let fx = -px, fy = 2 - py, fz = -pz;
    const fl = Math.hypot(fx, fy, fz);
    fx /= fl;
    fy /= fl;
    fz /= fl;
    let rx = -fz, rz = fx;
    const rl = Math.hypot(rx, rz);
    rx /= rl;
    rz /= rl;
    this.cam = {
      px, py, pz, fx, fy, fz, rx, rz,
      ux: -rz * fy, uy: rz * fx - rx * fz, uz: rx * fy,
      focal: Math.min(this.H / 2 / Math.tan((36 * Math.PI) / 360), this.W * 1.15),
      cx: this.W * (this.W > 900 ? 0.6 : 0.5),
      cy: this.H * (this.W > 900 ? 0.54 : 0.4),
    };
  }

  private proj(x: number, y: number, z: number): Pt | null {
    const c = this.cam;
    const dx = x - c.px, dy = y - c.py, dz = z - c.pz;
    const zc = dx * c.fx + dy * c.fy + dz * c.fz;
    if (zc < 2) return null;
    const xc = dx * c.rx + dz * c.rz;
    const yc = dx * c.ux + dy * c.uy + dz * c.uz;
    return [c.cx + (c.focal * xc) / zc, c.cy - (c.focal * yc) / zc, zc];
  }

  private buildAtlas() {
    const [cw, ch] = this.cell;
    const aw = Math.round(cw * this.dpr), ah = Math.round(ch * this.dpr);
    const cv = document.createElement('canvas');
    cv.width = aw * 10;
    cv.height = ah * 4;
    const a = cv.getContext('2d')!;
    a.textAlign = 'center';
    a.textBaseline = 'middle';
    a.font = `${Math.round(ch * 0.92 * this.dpr)}px "Departure Mono", monospace`;
    TIERS.forEach((col, ti) => {
      a.fillStyle = col;
      for (let g = 1; g < 10; g++) a.fillText(RAMP[g], g * aw + aw / 2, ti * ah + ah / 2);
    });
    this.atlas = cv;
    this.aw = aw;
    this.ah = ah;
  }

  private drawAscii(ctx: CanvasRenderingContext2D) {
    const [cw, ch] = this.cell;
    const cols = Math.ceil(this.W / cw), rows = Math.ceil(this.H / ch);
    if (!this.buf || this.buf.width !== cols || this.buf.height !== rows) {
      this.buf = document.createElement('canvas');
      this.buf.width = cols;
      this.buf.height = rows;
      this.bctx = this.buf.getContext('2d', { willReadFrequently: true })!;
    }
    if (!this.atlas) this.buildAtlas();
    const b = this.bctx!, cam = this.cam;
    b.setTransform(1, 0, 0, 1, 0, 0);
    b.fillStyle = '#000';
    b.fillRect(0, 0, cols, rows);
    b.setTransform(1 / cw, 0, 0, 1 / ch, 0, 0);
    b.strokeStyle = 'rgb(34,34,34)';
    b.lineWidth = 5;
    const RR = CITY + 2;
    for (let k = -Math.floor(RR / 6) * 6 + 3; k <= RR; k += 6) {
      const half = Math.sqrt(Math.max(0, RR * RR - k * k));
      const p1 = this.proj(k, 0, -half), p2 = this.proj(k, 0, half), p3 = this.proj(-half, 0, k), p4 = this.proj(half, 0, k);
      if (p1 && p2) {
        b.beginPath();
        b.moveTo(p1[0], p1[1]);
        b.lineTo(p2[0], p2[1]);
        b.stroke();
      }
      if (p3 && p4) {
        b.beginPath();
        b.moveTo(p3[0], p3[1]);
        b.lineTo(p4[0], p4[1]);
        b.stroke();
      }
    }
    for (const bk of this.blocks) bk.d = Math.hypot((bk.x0 + bk.x1) / 2 - cam.px, (bk.z0 + bk.z1) / 2 - cam.pz);
    this.blocks.sort((p, q) => q.d - p.d);
    const face = (pts: Pt[], v: number) => {
      const g = Math.round(Math.max(0, Math.min(1, v)) * 255);
      b.fillStyle = `rgb(${g},${g},${g})`;
      b.beginPath();
      b.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) b.lineTo(pts[i][0], pts[i][1]);
      b.closePath();
      b.fill();
    };
    for (const bk of this.blocks) {
      const fog = Math.max(0.16, Math.min(1, 1.35 - bk.d / 240)) * Math.max(0, Math.min(1, (bk.d - 30) / 30));
      if (fog <= 0.01) continue;
      const A = this.proj(bk.x0, 0, bk.z0), B = this.proj(bk.x1, 0, bk.z0), C = this.proj(bk.x1, 0, bk.z1), E = this.proj(bk.x0, 0, bk.z1);
      const A2 = this.proj(bk.x0, bk.h, bk.z0), B2 = this.proj(bk.x1, bk.h, bk.z0), C2 = this.proj(bk.x1, bk.h, bk.z1), E2 = this.proj(bk.x0, bk.h, bk.z1);
      if (!A || !B || !C || !E || !A2 || !B2 || !C2 || !E2) continue;
      if (cam.px < bk.x0) face([A, E, E2, A2], 0.4 * fog);
      else if (cam.px > bk.x1) face([B, C, C2, B2], 0.4 * fog);
      if (cam.pz < bk.z0) face([A, B, B2, A2], 0.6 * fog);
      else if (cam.pz > bk.z1) face([E, C, C2, E2], 0.6 * fog);
      face([A2, B2, C2, E2], 0.88 * fog);
    }
    const px = b.getImageData(0, 0, cols, rows).data;
    const { aw, ah } = this;
    const atlas = this.atlas!;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const v = px[(y * cols + x) * 4] / 255;
        if (v < 0.07) continue;
        const g = Math.min(9, Math.max(1, Math.round(v * 9)));
        const tier = v < 0.3 ? 0 : v < 0.5 ? 1 : v < 0.72 ? 2 : 3;
        ctx.drawImage(atlas, g * aw, tier * ah, aw, ah, x * cw, y * ch, cw, ch);
      }
    }
  }

  private drawTowers(ctx: CanvasRenderingContext2D) {
    const cam = this.cam, hot = this.hot;
    const list = [...this.towers];
    list.forEach((t) => (t.d = Math.hypot(t.x - cam.px, t.z - cam.pz)));
    list.sort((p, q) => q.d - p.d);
    const quad = (p: Pt[]) => {
      ctx.beginPath();
      ctx.moveTo(p[0][0], p[0][1]);
      for (let k = 1; k < 4; k++) ctx.lineTo(p[k][0], p[k][1]);
      ctx.closePath();
    };
    list.forEach((tw, i) => {
      const id = tw.node.id;
      const on = !hot || id === hot || this.related.has(id);
      const isHot = hot === id;
      const x0 = tw.x - tw.w, x1 = tw.x + tw.w, z0 = tw.z - tw.w, z1 = tw.z + tw.w, h = tw.h;
      ctx.globalAlpha = on ? 1 : 0.22;
      const neon = isHot ? '#7ff6ff' : '#ff3347';
      const ink = isHot ? '127,246,255' : '255,51,71';
      const faces: [number, number][][] = [];
      if (cam.px < x0) faces.push([[x0, z0], [x0, z1]]);
      else if (cam.px > x1) faces.push([[x1, z0], [x1, z1]]);
      if (cam.pz < z0) faces.push([[x0, z0], [x1, z0]]);
      else if (cam.pz > z1) faces.push([[x0, z1], [x1, z1]]);
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      const grow = (p: Pt) => {
        minX = Math.min(minX, p[0]);
        maxX = Math.max(maxX, p[0]);
        minY = Math.min(minY, p[1]);
        maxY = Math.max(maxY, p[1]);
      };
      faces.forEach((f, fi) => {
        const a = this.proj(f[0][0], 0, f[0][1]), b = this.proj(f[1][0], 0, f[1][1]), c = this.proj(f[1][0], h, f[1][1]), d = this.proj(f[0][0], h, f[0][1]);
        if (!a || !b || !c || !d) return;
        [a, b, c, d].forEach(grow);
        quad([a, b, c, d]);
        ctx.fillStyle = 'rgba(10,7,8,0.95)';
        ctx.fill();
        ctx.save();
        quad([a, b, c, d]);
        ctx.clip();
        const mid = this.proj((f[0][0] + f[1][0]) / 2, h / 2, (f[0][1] + f[1][1]) / 2);
        const size = Math.max(7, Math.min(14, (this.cam.focal * 0.62) / (mid ? mid[2] : 100)));
        ctx.font = `${Math.round(size)}px "Departure Mono", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const rows = Math.max(1, Math.floor((h - 0.5) / 0.72));
        for (let col = 0; col < 4; col++) {
          const u = (col + 0.5) / 4;
          const wx = f[0][0] + (f[1][0] - f[0][0]) * u, wz = f[0][1] + (f[1][1] - f[0][1]) * u;
          const seed = i * 7.3 + fi * 3.1 + col * 1.9;
          const head = (this.t * 4 + hash(seed) * 40) % (rows + 10);
          for (let k = 0; k < rows; k++) {
            const q = this.proj(wx, h - 0.55 - k * 0.72, wz);
            if (!q) continue;
            const behind = head - k;
            const glyph = HEX[Math.floor(hash(seed * 17 + k * 3.7 + Math.floor(this.t * 2 + hash(k + seed) * 4)) * 16)];
            if (behind >= 0 && behind < 1) ctx.fillStyle = isHot ? '#e6feff' : '#ffd3d7';
            else ctx.fillStyle = `rgba(${ink},${(behind > 0 && behind < 9 ? Math.max(0.16, 1 - behind / 9) : 0.16).toFixed(3)})`;
            ctx.fillText(glyph, q[0], q[1]);
          }
        }
        ctx.restore();
        ctx.shadowColor = neon;
        ctx.shadowBlur = isHot ? 14 : 8;
        ctx.strokeStyle = neon;
        ctx.lineWidth = 1.2;
        quad([a, b, c, d]);
        ctx.stroke();
        ctx.shadowBlur = 0;
      });
      const t0 = this.proj(x0, h, z0), t1 = this.proj(x1, h, z0), t2 = this.proj(x1, h, z1), t3 = this.proj(x0, h, z1);
      if (t0 && t1 && t2 && t3) {
        [t0, t1, t2, t3].forEach(grow);
        quad([t0, t1, t2, t3]);
        ctx.fillStyle = `rgba(${ink},0.32)`;
        ctx.fill();
        ctx.shadowColor = neon;
        ctx.shadowBlur = isHot ? 16 : 10;
        ctx.strokeStyle = neon;
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      const base = this.proj(tw.x, h, tw.z), tip = this.proj(tw.x, h + 3.2, tw.z);
      tw.tip = tip ? [tip[0], tip[1]] : null;
      tw.bbox = Number.isFinite(minX) ? [minX, minY, maxX, maxY] : null;
      if (base && tip) {
        ctx.strokeStyle = neon;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(base[0], base[1]);
        ctx.lineTo(tip[0], tip[1]);
        ctx.stroke();
        const blink = 0.55 + 0.45 * Math.sin(this.t * 3 + i * 1.7);
        ctx.fillStyle = isHot ? '#7ff6ff' : `rgba(255,51,71,${blink.toFixed(3)})`;
        ctx.fillRect(tip[0] - 2, tip[1] - 2, 4, 4);
      }
      ctx.globalAlpha = 1;
    });
  }

  private drawLinks(ctx: CanvasRenderingContext2D) {
    const hot = this.hot;
    const by = new Map(this.towers.map((t) => [t.node.id, t]));
    this.o.links.forEach(([from, to], n) => {
      const A = by.get(from), B = by.get(to);
      if (!A || !B) return;
      const ay = A.h + 0.3, byy = B.h + 0.3;
      const mx = (A.x + B.x) / 2, mz = (A.z + B.z) / 2;
      const my = Math.max(ay, byy) + 4 + Math.hypot(B.x - A.x, B.z - A.z) * 0.3;
      const pts: Pt[] = [];
      for (let i = 0; i <= 28; i++) {
        const u = i / 28, w0 = (1 - u) * (1 - u), w1 = 2 * (1 - u) * u, w2 = u * u;
        const p = this.proj(w0 * A.x + w1 * mx + w2 * B.x, w0 * ay + w1 * my + w2 * byy, w0 * A.z + w1 * mz + w2 * B.z);
        if (p) pts.push(p);
      }
      if (pts.length < 2) return;
      const touch = !!hot && (from === hot || to === hot);
      const alpha = !hot ? 0.36 : touch ? 1 : 0.05;
      ctx.strokeStyle = `rgba(255,51,71,${alpha})`;
      ctx.lineWidth = touch ? 1.8 : 1.1;
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.stroke();
      if (!hot || touch) {
        const u = (this.t * 0.16 + ((n * 0.6180339) % 1)) % 1;
        const f = u * (pts.length - 1), i0 = Math.floor(f), k = f - i0;
        const p0 = pts[i0], p1 = pts[Math.min(pts.length - 1, i0 + 1)];
        ctx.fillStyle = touch ? '#ffd3d7' : 'rgba(255,110,122,0.85)';
        ctx.fillRect(p0[0] + (p1[0] - p0[0]) * k - 1.5, p0[1] + (p1[1] - p0[1]) * k - 1.5, 3, 3);
      }
    });
  }

  private placeLabels(ctx: CanvasRenderingContext2D) {
    const hot = this.hot;
    const top = 62;
    const placed: { x: number; y: number; w: number; h: number }[] = [];
    const near = [...this.towers].sort((a, b) => a.d - b.d);
    for (const t of near) {
      const el = t.label;
      if (!t.tip) {
        el.style.opacity = '0';
        continue;
      }
      el.style.opacity = '';
      el.size ??= [el.offsetWidth, el.offsetHeight];
      const [w, h] = el.size;
      const r = { x: t.tip[0] - w / 2, y: t.tip[1] - 16 - h, w, h };
      for (let guard = 0; guard < 24; guard++) {
        const hit = placed.find((o) => r.x < o.x + o.w + 4 && r.x + r.w + 4 > o.x && r.y < o.y + o.h + 4 && r.y + r.h + 4 > o.y);
        if (!hit) break;
        if (hit.y - r.h - 6 > top) r.y = hit.y - r.h - 6;
        else r.x = r.x < hit.x ? hit.x - r.w - 6 : hit.x + hit.w + 6;
      }
      r.x = Math.max(4, Math.min(this.W - w - 4, r.x));
      placed.push(r);
      el.style.transform = `translate(${Math.round(r.x)}px, ${Math.round(r.y)}px)`;
      const id = t.node.id, isHot = hot === id;
      ctx.globalAlpha = !hot || isHot || this.related.has(id) ? 1 : 0.3;
      ctx.strokeStyle = isHot ? '#7ff6ff' : 'rgba(233,225,211,0.45)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(t.tip[0], t.tip[1] - 2);
      ctx.lineTo(r.x + w / 2, r.y + h);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }
}
