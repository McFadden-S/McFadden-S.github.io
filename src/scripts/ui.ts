const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)] as T[];
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function flash(btn: HTMLElement, text: string) {
  btn.dataset.label ??= btn.textContent ?? '';
  btn.textContent = text;
  window.setTimeout(() => (btn.textContent = btn.dataset.label!), 1600);
}
function selectEl(el: Element | null) {
  if (!el) return;
  const range = document.createRange();
  range.selectNodeContents(el);
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
}
document.addEventListener('click', (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-copy],[data-copy-from]');
  if (!btn) return;
  const src = btn.dataset.copyFrom ? document.getElementById(btn.dataset.copyFrom) : null;
  const text = btn.dataset.copy ?? src?.textContent ?? '';
  const fail = () => {
    selectEl(src ?? (btn.dataset.select ? document.getElementById(btn.dataset.select) : null));
    flash(btn, 'Selected, press Ctrl+C');
  };
  try {
    navigator.clipboard.writeText(text).then(() => flash(btn, 'Copied'), fail);
  } catch {
    fail();
  }
});

const crtBtn = document.querySelector<HTMLButtonElement>('[data-crt-toggle]');
function setCrt(on: boolean) {
  document.documentElement.dataset.crt = on ? 'on' : 'off';
  crtBtn?.setAttribute('aria-pressed', String(on));
  document.dispatchEvent(new Event('crtchange'));
}
if (crtBtn) {
  setCrt(document.documentElement.dataset.crt !== 'off');
  crtBtn.addEventListener('click', () => {
    const on = document.documentElement.dataset.crt === 'off';
    setCrt(on);
    try {
      localStorage.setItem('crt', on ? 'on' : 'off');
    } catch {
    }
  });
}

document.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[data-youtube]');
  if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
  e.preventDefault();
  const f = document.createElement('iframe');
  f.src = `https://www.youtube-nocookie.com/embed/${a.dataset.youtube}?autoplay=1&rel=0`;
  f.title = a.dataset.title ?? 'Video';
  f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  f.referrerPolicy = 'strict-origin-when-cross-origin';
  f.allowFullscreen = true;
  a.replaceWith(f);
  f.focus();
});

document.addEventListener('click', (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-toggle]');
  if (!btn) return;
  const el = document.getElementById(btn.dataset.toggle!);
  if (!el) return;
  el.hidden = !el.hidden;
  btn.setAttribute('aria-expanded', String(!el.hidden));
  if (btn.hasAttribute('data-hide-self')) btn.hidden = true;
});

for (const ax of $$('.hb-axis')) {
  if (ax.style.getPropertyValue('--label-w')) continue;
  let hb = ax.previousElementSibling as HTMLElement | null;
  while (hb && !hb.classList.contains('hb')) hb = hb.previousElementSibling as HTMLElement | null;
  const lw = hb?.style.getPropertyValue('--label-w');
  if (lw) ax.style.setProperty('--label-w', lw.trim());
}

for (const fig of $$('.chart')) {
  let tip = fig.querySelector<HTMLElement>(':scope > .tip');
  if (!tip) {
    tip = document.createElement('div');
    tip.className = 'tip';
    tip.hidden = true;
    fig.appendChild(tip);
  }
  const t = tip;
  const show = (el: HTMLElement, clientX?: number) => {
    const [title, ...lines] = (el.dataset.tip ?? '').split('|');
    t.innerHTML = `<b>${esc(title)}</b>` + lines.map((l) => `<span>${esc(l)}</span>`).join('');
    t.hidden = false;
    const fr = fig.getBoundingClientRect();
    const rr = el.getBoundingClientRect();
    const x = clientX ?? rr.left + rr.width / 2;
    const left = Math.max(0, Math.min(x - fr.left - t.offsetWidth / 2, fr.width - t.offsetWidth));
    let top = rr.top - fr.top - t.offsetHeight - 8;
    if (top < 0) top = rr.bottom - fr.top + 8;
    t.style.left = `${left}px`;
    t.style.top = `${top}px`;
  };
  const hide = () => (t.hidden = true);
  for (const el of $$('[data-tip]', fig)) {
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
    el.addEventListener('pointermove', (e) => show(el, (e as PointerEvent).clientX));
    el.addEventListener('pointerleave', hide);
    el.addEventListener('focus', () => show(el));
    el.addEventListener('blur', hide);
  }
}

for (const ex of $$('.explorer')) {
  const tabs = $$<HTMLButtonElement>('.ex-tab', ex);
  ex.querySelector('.ex-tabs')?.setAttribute('role', 'tablist');
  const select = (tab: HTMLButtonElement) => {
    for (const o of tabs) {
      const on = o === tab;
      o.setAttribute('role', 'tab');
      o.setAttribute('aria-selected', String(on));
      o.tabIndex = on ? 0 : -1;
      const p = document.getElementById(o.getAttribute('aria-controls') ?? '');
      if (p) {
        p.hidden = !on;
        p.setAttribute('role', 'tabpanel');
      }
    }
  };
  ex.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLButtonElement>('.ex-tab');
    if (t && ex.contains(t)) select(t);
  });
  ex.addEventListener('keydown', (e) => {
    const i = tabs.indexOf(document.activeElement as HTMLButtonElement);
    const d = ({ ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 } as Record<string, number>)[e.key];
    if (i < 0 || !d) return;
    e.preventDefault();
    const n = tabs[(i + d + tabs.length) % tabs.length];
    select(n);
    n.focus();
  });
  select(tabs.find((t) => t.getAttribute('aria-selected') === 'true') ?? tabs[0]);
}

const tocLinks = $$<HTMLAnchorElement>('.toc a[href^="#"]');
if (tocLinks.length && 'IntersectionObserver' in window) {
  const map = new Map(tocLinks.map((a) => [a.getAttribute('href')!.slice(1), a]));
  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        tocLinks.forEach((a) => a.removeAttribute('aria-current'));
        map.get(en.target.id)?.setAttribute('aria-current', 'true');
      }
    },
    { rootMargin: '-30% 0px -60% 0px' },
  );
  map.forEach((_a, id) => {
    const s = document.getElementById(id);
    if (s) io.observe(s);
  });
}

const NOISE = '01#%@*+=-:.ABCDEF';
const SKIP = 'script, style, pre, code, textarea, noscript, .site-head, .tip, [data-no-decode]';
const BLOCK = 'p, li, h1, h2, h3, h4, h5, h6, dt, dd, figcaption, blockquote, caption, td, th, summary, label, button, text, div';

function textNodes(root: Node, skipDecode = true): Text[] {
  const out: Text[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => {
      const p = n.parentElement;
      if (!p || !n.nodeValue?.trim() || p.closest(SKIP) || (skipDecode && p.closest('[data-decode]'))) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  while (walker.nextNode()) out.push(walker.currentNode as Text);
  return out;
}

function decodeText(nodes: Text[], duration: number, held?: HTMLElement) {
  const final = nodes.map((n) => n.data);
  const written = final.slice();
  const live = nodes.map(() => true);
  const total = final.reduce((sum, f) => sum + f.length, 0) || 1;
  const start = performance.now();
  const step = (now: number) => {
    const p = Math.min(1, Math.max(0, (now - start) / duration));
    const fixed = p * total;
    let offset = 0;
    nodes.forEach((n, i) => {
      const f = final[i];
      if (live[i] && n.data !== written[i]) live[i] = false;
      if (live[i]) {
        let out = f;
        if (p < 1) {
          out = '';
          for (let k = 0; k < f.length; k++) out += offset + k < fixed || /\s/.test(f[k]) ? f[k] : NOISE[Math.floor(Math.random() * NOISE.length)];
        }
        n.data = written[i] = out;
      }
      offset += f.length;
    });
    if (p < 1) requestAnimationFrame(step);
    else if (held) held.style.minHeight = '';
  };
  step(start);
  requestAnimationFrame(step);
}

if (!reduced) {
  for (const el of $$('[data-decode]')) decodeText(textNodes(el, false), Number(el.dataset.decode) || 900);

  const groups = new Map<Element, Text[]>();
  for (const root of $$('main, .site-foot')) {
    for (const t of textNodes(root)) {
      const block = t.parentElement!.closest(BLOCK) ?? t.parentElement!;
      const list = groups.get(block);
      if (list) list.push(t);
      else groups.set(block, [t]);
    }
  }
  const vh = window.innerHeight;
  const onScreen: { block: Element; nodes: Text[]; height: number }[] = [];
  for (const [block, nodes] of groups) {
    const r = block.getBoundingClientRect();
    if (r.height === 0 || r.bottom < 0 || r.top > vh) continue;
    onScreen.push({ block, nodes, height: r.height });
  }
  for (const g of onScreen) if (g.block instanceof HTMLElement) g.block.style.minHeight = `${g.height}px`;
  for (const g of onScreen) {
    const chars = g.nodes.reduce((sum, t) => sum + t.data.length, 0);
    decodeText(g.nodes, Math.min(1000, 320 + chars * 3), g.block instanceof HTMLElement ? g.block : undefined);
  }
}
