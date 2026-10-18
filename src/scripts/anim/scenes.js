export const DESCRIPTIONS = {
  "replicant": "An agent edits a malware sample feature by feature and queries a label-only detector until the sample is labelled goodware, then the detector retrains on adversarial samples",
  "sok": "An agent walks the four stages of a DRL pipeline while the pitfall prevalence bars for each stage fill in",
  "direction": "Source code is scanned function by function through the ML4AVD pipeline; each function gets only a binary label while type, affected lines and trigger conditions stay unknown",
  "acdenv": "A red agent compromises hosts across a network while a blue agent restores them, working from a delayed and partial observation",
  "drmd": "Samples arrive month by month as malware drifts away from the training data; the DRMD agent classifies each one or rejects it to manual labeling, with the reward for each decision shown",
  "onepic": "One image is injected into a knowledge base of document images; the retriever returns it for a user query and the VLM answers with the attacker's target",
  "onepic-short": "A document image is perturbed step by step while the retrieval and generation losses fall until both conditions are met",
  "alpoison": "Monthly F1 of a hypothetical model trained without poisoning, with its tolerance margin, against the poisoned model, which drops and then recovers into the margin as active learning labels new samples",
  "wendigo": "The paper's example GraphQL state grows and shrinks through add and remove actions; each action changes the query, the response time is the reward, and an action past the bounds is skipped",
  "tesseract": "A random split mixes training and testing months and scores high; a time-aware split tests month by month after 2014 and the F1 falls over time",
  "rpal": "Apps in feature space with a learned decision boundary: label flips pull the boundary across the malware, and each month uncertainty sampling labels the apps closest to it until the boundary is back"
};

export const SCENES = {
  replicant(e, t) {
    e.head('REPLICANT', 'arXiv 2026');
    const C = 17, tc = t % C, cyc = Math.floor(t / C);
    const Q = 5, per = 2.2;
    const qf = Math.min(Q, tc / per);
    const done = tc / per >= Q;
    const q = done ? Q : Math.floor(qf) + 1;
    const sub = done ? 1 : qf - Math.floor(qf);
    const modify = !done && sub < 0.55;
    e.P(3, 4, 'malware sample, binary features', 'a');
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 26; c++) {
        const id = r * 26 + c;
        const base = e.h(id + cyc * 31) < 0.3;
        const at = 1 + Math.floor(e.h(id * 3.1 + cyc * 7) * Q * 2.5);
        const on = base || at < q || (at === q && sub > 0.3 && at <= Q);
        const fresh = !base && at === q && sub > 0.3 && sub < 0.7;
        e.P(3 + c * 2, 6 + r, on ? '1' : '0', fresh ? 'i' : on ? (base ? 'r' : 'b') : 's');
      }
    }
    e.box(3, 12, 34, 8, 'a');
    e.P(5, 13, 'REPLICANT agent', 'b');
    e.P(5, 15, 'query policy', 'a');
    e.P(20, 15, done ? 'done' : modify ? 'MODIFY' : 'SUBMIT', done ? 'i' : modify ? 'b' : 'r');
    e.P(5, 16, 'modify policy', 'a');
    e.P(20, 16, modify ? 'gadget ' + (10 + Math.floor(e.h(q + cyc * 5) * 89)) : '-', 'b');
    e.P(5, 18, 'query ' + q + ' of 20', 'a');
    e.hl(38, 16, 18, '-', 's');
    if (!done && !modify) e.P(38 + ((sub - 0.55) / 0.45) * 16, 16, '>>', 'r');
    const flash = tc > Q * per + 1.5 && tc % 0.8 < 0.4;
    e.box(57, 12, 30, 8, flash ? 'i' : 'a');
    e.P(59, 13, 'target detector', 'b');
    e.P(59, 14, 'label-only access', 'a');
    e.P(59, 16, 'label', 'a');
    e.P(66, 16, done ? 'goodware' : sub > 0.9 ? 'malware' : '...', done ? 'i' : 'r');
    e.P(3, 23, 'queries', 'a');
    for (let k = 1; k <= Q; k++) {
      const shown = k < q || (k === q && (done || sub > 0.9));
      if (!shown) continue;
      const evaded = done && k === Q;
      e.P(12 + (k - 1) * 13, 23, 'q' + k + ' ' + (evaded ? 'goodware' : 'malware'), evaded ? 'i' : 'r');
    }
    if (done) e.P(3, 26, 'evaded in ' + Q + ' queries', 'i');
    if (tc > Q * per + 1.5) {
      e.P(57, 22, 'adversarial training', 'b');
      e.P(57, 23, 'round ' + ((cyc % 15) + 1) + ' of 15', 'a');
    }
  },

  sok(e, t) {
    e.head('DRL4Sec SoK', 'USENIX Sec 2026');
    const stages = [
      ['Environment', 'modeling', [['M-MS', 59.1], ['M-MC', 34.9], ['M-PO', 60.6]]],
      ['Agent', 'training', [['T-HR', 68.2], ['T-VA', 66.7], ['T-PC', 71.2]]],
      ['Performance', 'evaluation', [['E-AM', 43.9], ['E-GA', 50.0], ['E-EC', 40.9]]],
      ['System', 'deployment', [['D-UA', 28.8], ['D-NS', 54.5]]],
    ];
    const C = 15, tc = t % C;
    const pos = Math.min(1, tc / 10) * 86;
    e.hl(2, 10, pos, '.', 's');
    stages.forEach((s, i) => {
      const x = 2 + i * 22;
      const lit = pos > x + 2;
      e.box(x, 5, 20, 4, lit ? 'r' : 'a');
      e.P(x + 2, 6, s[0], 'b');
      e.P(x + 2, 7, s[1], 'b');
      if (i < 3) e.P(x + 20, 7, '>', 's');
      s[2].forEach((p, k) => {
        const y = 13 + k * 3;
        const f = lit ? Math.min(1, (pos - x - 2) / 14) : 0;
        e.P(x, y, p[0], lit ? 'r' : 'a');
        if (f >= 1) e.P(x + 5, y, '!', 'h');
        e.bar(x, y + 1, 12, (f * p[1]) / 100, 'r', 's');
        if (lit) e.P(x + 13, y + 1, (p[1] * f).toFixed(1) + '%', 'b');
      });
    });
    e.P(Math.min(87, Math.round(pos) + 2), 10, '@', 'i');
    e.P(2, 24, 'pitfalls present or partially present, out of 66 papers reviewed', 'a');
  },

  direction(e, t) {
    e.head('Direction for Detection', 'TMLR 2026');
    const code = [
      'int parse(char *buf, int n) {', '  char tmp[64];', '  int len = n;', '  memcpy(tmp, buf, len);', '  return tmp[0];', '}', '',
      'void greet(const char *name) {', '  printf("hello %s", name);', '}', '',
      'int sum(int *a, int n) {', '  int s = 0;', '  for (int i = 0; i <= n; i++)', '    s += a[i];', '  return s;', '}', '',
      'char *copy(const char *s) {', '  char *d = malloc(strlen(s) + 1);', '  strcpy(d, s);', '  return d;', '}', '',
    ];
    const fns = [[0, 5, 3], [7, 9, -1], [11, 16, 13], [18, 22, -1]];
    const per = 3.2, fi = Math.floor(t / per) % fns.length, fp = (t % per) / per;
    const f = fns[fi];
    e.box(2, 4, 48, 27, 'a');
    e.P(4, 4, ' source ', 'a');
    const off = Math.max(0, Math.min(code.length - 23, f[0] - 4));
    for (let k = 0; k < 23; k++) {
      const i = off + k;
      if (i >= code.length) break;
      const inFn = i >= f[0] && i <= f[1];
      const bad = inFn && i === f[2] && fp > 0.5;
      e.P(4, 6 + k, code[i], bad ? 'r' : inFn ? 'b' : 's');
      if (bad) e.P(44, 6 + k, '<', 'r');
      if (inFn && Math.floor(fp * (f[1] - f[0] + 1)) === i - f[0]) e.P(3, 6 + k, '>', 'i');
    }
    const steps = ['data', 'representation', 'model', 'output', 'evaluation'];
    steps.forEach((s, k) => {
      const active = Math.floor(fp * 5) === k;
      e.P(55, 5 + k * 3, (active ? '[ ' : '  ') + s + (active ? ' ]' : ''), active ? 'r' : 'a');
      if (k < 4) e.P(57, 6 + k * 3, '|', 's');
    });
    e.hl(55, 21, 32, '-', 's');
    e.P(55, 22, 'function-level label', 'a');
    if (fp > 0.6) e.P(55, 23, f[2] >= 0 ? '1  vulnerable' : '0  not vulnerable', f[2] >= 0 ? 'r' : 'b');
    e.P(55, 25, 'vulnerability type   ?', 's');
    e.P(55, 26, 'affected lines       ?', 's');
    e.P(55, 27, 'trigger conditions   ?', 's');
  },

  acdenv(e, t) {
    e.head('ACD Environments', 'AAMAS Workshop 2026');
    const H = [[6, 7], [17, 7], [28, 7], [6, 14], [17, 14], [28, 14], [41, 10], [49, 17], [41, 24], [17, 22], [6, 22], [30, 28]];
    const L = [[0, 1], [1, 2], [3, 4], [4, 5], [1, 4], [2, 6], [5, 6], [6, 7], [7, 8], [8, 11], [4, 9], [9, 10], [9, 11]];
    const path = [10, 9, 4, 5, 6, 7, 8, 11, 9, 4, 1, 2, 6];
    const per = 0.9, C = 24, tc = t % C, n = Math.floor(tc / per);
    L.forEach((l) => {
      const a = H[l[0]], b = H[l[1]], steps = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]) * 2);
      for (let s = 1; s < steps; s++) {
        const x = Math.round(a[0] + ((b[0] - a[0]) * s) / steps), y = Math.round(a[1] + ((b[1] - a[1]) * s) / steps);
        e.P(x, y, '.', 's');
      }
    });
    const comp = H.map(() => false), restored = H.map(() => -9);
    let red = path[0], blue = -1;
    for (let s = 0; s <= n; s++) {
      red = path[s % path.length];
      comp[red] = true;
      if (s % 3 === 2) {
        const target = comp.findIndex((c, i) => c && i !== red);
        if (target >= 0) { comp[target] = false; restored[target] = s; blue = target; }
      }
    }
    H.forEach((p, i) => {
      const fresh = n - restored[i] <= 1;
      e.P(p[0] - 1, p[1], '[', 'a');
      e.P(p[0] + 1, p[1], ']', 'a');
      e.P(p[0], p[1], comp[i] ? 'x' : fresh ? 'o' : ' ', comp[i] ? 'r' : 'i');
      e.P(p[0] - 1, p[1] + 1, 'h' + String(i + 1).padStart(2, '0'), 's');
    });
    e.P(H[red][0], H[red][1] - 1, 'R', 'r');
    if (blue >= 0) e.P(H[blue][0] + 2, H[blue][1] - 1, 'B', 'i');
    e.P(3, 4, 'network', 'a');
    e.P(3, 31, 'step t = ' + n, 'b');
    e.box(60, 4, 27, 19, 'a');
    e.P(62, 5, 'blue observation', 'b');
    const hidden = [2, 7, 11];
    H.forEach((p, i) => {
      const y = 7 + Math.floor(i / 2) * 2, x = 62 + (i % 2) * 12;
      const seen = !hidden.includes(i);
      let was = false;
      if (seen) {
        const c2 = H.map(() => false);
        for (let s = 0; s <= n - 1; s++) {
          const r = path[s % path.length]; c2[r] = true;
          if (s % 3 === 2) { const tg = c2.findIndex((c, k) => c && k !== r); if (tg >= 0) c2[tg] = false; }
        }
        was = c2[i];
      }
      e.P(x, y, 'h' + String(i + 1).padStart(2, '0') + ' ' + (seen ? (was ? 'x' : '-') : '?'), seen ? (was ? 'r' : 'a') : 's');
    });
    e.P(60, 25, '[x] compromised', 'r');
    e.P(60, 26, '[o] restored', 'i');
    e.P(60, 27, ' ?  not observed', 's');
  },

  drmd(e, t) {
    e.head('DRMD', 'AAAI 2026');
    const C = 24, tc = t % C, cyc = Math.floor(t / C), month = Math.min(11, Math.floor(tc / 2));
    e.P(3, 4, 'month', 'a');
    for (let m = 0; m < 12; m++) e.P(10 + m * 4, 4, String(m + 1).padStart(2, '0'), m === month ? 'r' : m < month ? 'b' : 's');
    e.box(36, 7, 15, 9, 'a');
    e.P(38, 8, 'DRMD agent', 'b');
    e.P(38, 10, 'classify', 'a');
    e.P(38, 11, 'or reject', 'a');
    e.P(53, 7, 'goodware', 'b');
    e.P(53, 10, 'malware', 'r');
    e.P(53, 13, 'reject', 'i');
    e.hl(2, 11, 33, '.', 's');
    const glyph = (mal, m) => (mal ? ['#%#', '%@%', '@*@', '*+*'][Math.floor(m / 3)] : '.:.');
    const log = [];
    for (let k = 0; k < 44; k++) {
      const born = k * 0.6 - 2, age = tc - born;
      const id = cyc * 1000 + k;
      const mal = e.h(id) < 0.4;
      const m = Math.min(11, Math.max(0, Math.floor(born / 2)));
      const rej = e.h(id * 7.7) < 0.22 + m * 0.035 + (mal ? m * 0.015 : 0);
      const wouldRight = e.h(id * 5.3) > (rej ? 0.4 + m * 0.03 : 0.04 + m * 0.006);
      const right = rej || wouldRight;
      if (age >= 2.6) log.push({ mal, rej, right, wouldRight, age });
      if (age < 0 || age > 7) continue;
      if (age < 2.6) {
        e.P(2 + age * 12, 11, glyph(mal, m), mal ? 'r' : 'b');
      } else {
        const says = rej ? 'rej' : right ? (mal ? 'mal' : 'good') : mal ? 'good' : 'mal';
        const lane = says === 'rej' ? 13 : says === 'mal' ? 10 : 7;
        const x = 62 + (age - 2.6) * 8;
        if (x < 86) e.P(x, lane, glyph(mal, m), rej ? 'i' : right ? (mal ? 'r' : 'b') : 'h');
        if (!right && x < 84) e.P(x + 3, lane, '!', 'h');
      }
    }
    e.box(53, 16, 27, 4, 'i');
    e.P(55, 17, 'manual labeling', 'i');
    e.P(55, 18, 'labels used to retrain', 'a');
    e.vl(42, 16, 3, '|', 's');
    e.P(42, 16, '^', 'i');
    e.hl(42, 18, 11, '-', 's');
    e.P(53, 22, 'rewards', 'a');
    log.slice(-6).reverse().forEach((d, i) => {
      const what = (d.mal ? 'malware ' : 'goodware') + '  ' + (d.rej ? 'reject  ' : 'classify');
      const good = d.rej ? !d.wouldRight : d.right;
      const r = (good ? '+' : '-') + (d.rej ? 'R_rej' : 'R_clf');
      e.P(53, 24 + i, what, 'a');
      e.P(76, 24 + i, r, good ? (d.rej ? 'i' : 'b') : 'r');
    });
    e.P(3, 18, 'drift', 'a');
    const H = 7, B = 30, x0 = 3, base = 28;
    const train = (b) => Math.exp(-((b - 9) ** 2) / 18);
    const now = (b) => Math.exp(-((b - 9 - month * 1.3) ** 2) / 22);
    for (let b = 0; b < B; b++) {
      const ht = Math.round(train(b) * H), hn = Math.round(now(b) * H);
      for (let j = 0; j < Math.max(ht, hn); j++) {
        const inT = j < ht, inN = j < hn;
        e.P(x0 + b, base - j, inN && inT ? '%' : inN ? '#' : ':', inN ? 'r' : 's');
      }
    }
    e.hl(x0, base + 1, B, '-', 's');
    e.P(x0, base + 2, ':  training months', 'a');
    e.P(x0, base + 3, '#  month ' + String(month + 1).padStart(2, '0'), 'r');
  },

  onepic(e, t) {
    e.head('One Pic', 'TMLR 2026');
    const C = 16, tc = t % C;
    const poisonSlot = 7, inject = tc > 1.5;
    e.P(3, 4, 'knowledge base', 'a');
    for (let k = 0; k < 15; k++) {
      const r = Math.floor(k / 5), c = k % 5, x = 3 + c * 10, y = 6 + r * 7;
      const isPoison = k === poisonSlot && inject;
      const scan = tc > 4 && tc < 8 && Math.floor((tc - 4) / 0.26) % 15 === k;
      const chosen = tc >= 8 && isPoison;
      e.box(x, y, 8, 6, chosen ? 'r' : scan ? 'i' : 's');
      for (let j = 0; j < 3; j++) {
        if (isPoison) {
          let s = '';
          for (let i = 0; i < 6; i++) s += '#%@&*=+'[Math.floor(e.h(i + j * 7 + Math.floor(t * 8)) * 7)];
          e.P(x + 1, y + 1 + j, s, 'r');
        } else {
          e.P(x + 1, y + 1 + j, '='.repeat(2 + Math.floor(e.h(k * 9 + j) * 5)), 'a');
        }
      }
    }
    if (inject && tc < 4) e.P(3, 28, 'one image injected', 'r');
    e.box(56, 4, 31, 4, 'a');
    const qText = 'q: user query';
    e.P(58, 5, 'query', 'a');
    e.P(58, 6, qText.slice(0, Math.max(0, Math.floor((tc - 2) * 8))), 'b');
    e.P(56, 9, 'retriever', tc > 4 && tc < 8 ? 'i' : 'a');
    if (tc >= 8) e.P(56, 10, 'top-1: the injected image', 'r');
    e.box(56, 12, 31, 6, tc >= 9 ? 'r' : 'a');
    e.P(58, 13, 'VLM', 'b');
    e.P(58, 15, 'context: retrieved image', 'a');
    e.P(56, 20, 'answer', 'a');
    const ans = "the attacker's target answer";
    if (tc >= 10) e.P(56, 21, ans.slice(0, Math.floor((tc - 10) * 10)), 'r');
  },

  'onepic-short'(e, t) {
    e.head('One Pic (short)', 'ACL Workshop 2025');
    const C = 14, tc = t % C, it = Math.min(1, tc / 10);
    const page = [
      '############################', '#                          #', '#  ==================      #', '#                          #',
      '#  =====================   #', '#  =================       #', '#  ====================    #', '#                          #',
      '#   |    |                 #', '#   |  | |  |    =======   #', '#   |  | |  |  | =====     #', '#   |__|_|__|__|           #',
      '#                          #', '#  ===================     #', '#  ==============          #', '############################',
    ];
    e.P(3, 4, 'document image', 'a');
    page.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        const n = e.h(x * 31 + y * 17 + Math.floor(t * 3));
        const perturbed = n < it * 0.22;
        const c = row[x] === ' ' ? (perturbed ? '.' : ' ') : row[x];
        e.P(3 + x, 6 + y, c, perturbed ? 'r' : row[x] === '#' ? 's' : 'b');
      }
    });
    e.P(3, 23, 'red: the small perturbation', 'r');
    e.P(40, 4, 'L_RAG = lambda_R L_R + lambda_G L_G', 'b');
    e.P(40, 6, 'optimisation', 'a'); e.bar(53, 6, 22, it, 'b');
    const lr = 1 - Math.min(1, it * 1.4), lg = 1 - Math.min(1, it * 1.1);
    e.P(40, 9, 'L_R', 'a'); e.bar(45, 9, 30, lr, 'r');
    e.P(40, 11, 'L_G', 'a'); e.bar(45, 11, 30, lg, 'r');
    e.P(40, 14, 'retrieval condition', 'a');
    e.P(62, 14, lr < 0.25 ? 'met' : '...', lr < 0.25 ? 'i' : 's');
    e.P(40, 15, 'generation condition', 'a');
    e.P(62, 15, lg < 0.15 ? 'met' : '...', lg < 0.15 ? 'i' : 's');
  },

  alpoison(e, t) {
    e.head('Passive Recovery', 'ACSAC Workshop 2024');
    const M = 24, per = 0.7, C = M * per + 4, tc = t % C, m = Math.min(M - 1, Math.floor(tc / per));
    const x0 = 8, dx = 3, top = 6, rows = 14, margin = 2;
    const clean = (k) => top + 3 + Math.round((e.h(k * 1.7) - 0.5) * 1.6);
    const intercept = 13;
    const pois = (k) => {
      if (k === 0) return clean(0);
      if (k < 4) return clean(k) + Math.round((k / 3) * 9);
      if (k < intercept) return clean(k) + Math.max(margin + 1, Math.round(9 - ((k - 3) / (intercept - 3)) * 7));
      return clean(k) + Math.round(e.h(k * 3) * margin);
    };
    e.P(2, top, 'F1', 'a');
    e.vl(5, top, rows + 1, '|', 's');
    e.hl(5, top + rows + 1, M * dx + 3, '-', 's');
    for (let k = 0; k <= m; k++) {
      const x = x0 + k * dx;
      for (let j = 1; j <= margin; j++) e.P(x, clean(k) + j, '.', 's');
      const yc = clean(k), yp = pois(k), within = k >= intercept;
      e.P(x, yc, 'o', 'b');
      if (yp !== yc) e.P(x, yp, within ? '+' : 'x', within ? 'i' : 'r');
    }
    e.P(x0 + 1, top - 1, 'o  no poisoning (hypothetical)', 'b');
    e.P(x0 + 34, top - 1, 'x  poisoned', 'r');
    e.P(x0 + 50, top - 1, '.  tolerance margin', 'a');
    if (m >= intercept) {
      e.P(x0 + intercept * dx, top + rows + 2, '^', 'i');
      e.P(x0 + intercept * dx - 3, top + rows + 3, 'intercept', 'i');
    }
    e.P(x0, top + rows + 3, 'month', 'a');
    e.P(2, 27, 'training data', 'a');
    for (let k = 0; k <= m; k++) {
      const x = x0 + k * dx;
      e.P(x, 29, 'o', 'b');
      if (k >= 1) e.P(x, 30, 'x', 'r');
      if (k >= 1) e.P(x, 31, '+', 'i');
    }
    e.P(x0, 32, 'o  clean     x  poisoned     +  labelled through active learning', 'a');
  },

  wendigo(e, t) {
    e.head('Wendigo', 'S&P Workshop 2024');
    const names = ['users-DUP', 'users_email-DUP', 'users_posts-DUP', 'users_posts_content-ALIAS'];
    const acts = [
      null, ['add', 1], ['add', 3], ['add', 3], ['add', 2], ['add', 1], ['remove', 1], ['add', 3], ['add', 3], ['add', 3],
    ];
    const per = 1.8, C = acts.length * per + 2, tc = t % C, n = Math.min(acts.length - 1, Math.floor(tc / per)), ph = (tc % per) / per;
    const MAXH = 5;
    const st = [1, 1, 1, 1];
    let skipped = false;
    for (let k = 1; k <= n; k++) {
      const a = acts[k], v = st[a[1]] + (a[0] === 'add' ? 1 : -1);
      skipped = v < 1 || v > MAXH;
      if (!skipped) st[a[1]] = v;
    }
    e.P(3, 4, 'state  [' + st.join(', ') + ']', 'b');
    names.forEach((nm, i) => {
      const hit = n > 0 && acts[n][1] === i;
      e.P(3, 6 + i, nm, hit ? (skipped ? 'r' : 'i') : 'a');
      e.P(30, 6 + i, '#'.repeat(st[i]) + '-'.repeat(MAXH - st[i]), hit ? (skipped ? 'r' : 'i') : 'r');
      e.P(37, 6 + i, String(st[i]), 'b');
    });
    e.P(3, 11, 'max depth 5   max height 5   multiplier 1', 's');
    const q = ['query {'];
    for (let u = 0; u < st[0]; u++) {
      q.push('  users {');
      for (let k = 0; k < st[1]; k++) q.push('    email');
      for (let p = 0; p < st[2]; p++) {
        q.push('    posts {');
        for (let a = 0; a < st[3]; a++) q.push('      C' + (a + 1) + ':content');
        q.push('    }');
      }
      q.push('  }');
    }
    q.push('}');
    e.P(3, 13, 'query', 'a');
    q.slice(0, 19).forEach((line, i) => e.P(3, 14 + i, line, 'b'));
    const loop = ['agent (PPO)', 'action', 'state', 'query', 'response time', 'reward'];
    const at = Math.floor(ph * loop.length);
    loop.forEach((s, i) => {
      const on = i === at && !(skipped && i >= 3);
      e.P(48, 5 + i * 3, (on ? '> ' : '  ') + s, on ? 'r' : 'a');
      if (i < loop.length - 1) e.P(50, 6 + i * 3, '|', 's');
    });
    e.vl(46, 5, 16, '|', 's');
    e.P(46, 5, '+', 's');
    e.P(46, 20, '+', 's');
    if (n > 0) e.P(66, 8, acts[n][0] + ' ' + names[acts[n][1]].split('_').pop(), skipped ? 'r' : 'i');
    if (skipped) e.P(66, 11, 'invalid: skipped, 0 s', 'r');
    const cost = st[0] * (st[1] + st[2] * (1 + st[3]));
    e.P(48, 24, 'response time = reward', 'a');
    e.bar(48, 25, 36, skipped ? 0 : Math.min(1, cost / 26), 'r');
  },

  tesseract(e, t) {
    e.head('TESSERACT', 'arXiv 2024');
    const C = 16, tc = t % C, cyc = Math.floor(t / C);
    const x0 = 14;
    const years = ['2014', '2015', '2016', '2017', '2018'];
    e.P(3, 4, 'k-fold, random split', 'b');
    e.P(3, 6, 'months', 'a');
    for (let k = 0; k < 60; k++) {
      const test = e.h(k + Math.floor(tc / 2) * 61 + cyc * 7) < 0.2;
      e.P(x0 + k, 6, '#', test ? 'r' : 'b');
    }
    e.P(3, 8, 'F1', 'a');
    e.bar(x0, 8, 40, 0.92, 'b');
    e.P(3, 12, 'time-aware split', 'b');
    e.P(3, 14, 'months', 'a');
    const cur = Math.min(47, Math.floor(Math.max(0, tc - 1) * 4.5));
    for (let k = 0; k < 60; k++) {
      const train = k < 12, tested = !train && k - 12 <= cur;
      e.P(x0 + k, 14, '#', train ? 'b' : tested ? 'r' : 's');
    }
    years.forEach((y, i) => e.P(x0 + i * 12, 15, y, 'a'));
    const bh = (k) => Math.max(1, Math.round(9 * (0.95 - 0.55 * Math.pow(k / 47, 0.7)) + (e.h(k) - 0.5) * 1.5));
    e.P(3, 18, 'F1', 'a');
    for (let k = 0; k <= cur; k++) {
      const h = bh(k);
      for (let j = 0; j < h; j++) e.P(x0 + 12 + k, 27 - j, j === h - 1 ? '#' : ':', j === h - 1 ? 'r' : 'd');
    }
    e.hl(x0, 28, 60, '-', 's');
    if (cur >= 47) e.P(x0 + 30, 19, 'AUT: area under the F1 curve over time', 'i');
    e.P(x0, 30, 'train', 'b');
    e.P(x0 + 8, 30, 'test', 'r');
  },

  rpal(e, t) {
    e.head('RPAL', 'CCS 2023');
    const C = 20, tc = t % C, cyc = Math.floor(t / C);
    const months = 6, per = 2.6, mo = Math.min(months, Math.floor(tc / per)), ph = (tc % per) / per;
    const X0 = 4, X1 = 56, Y0 = 6, Y1 = 30;
    const pts = [];
    for (let i = 0; i < 70; i++) {
      const x = X0 + 2 + Math.floor(e.h(i * 7.1 + 3) * (X1 - X0 - 4));
      const y = Y0 + 1 + Math.floor(e.h(i * 3.3 + 1) * (Y1 - Y0 - 2));
      const trueX = 30 + (y - 18) * 0.35;
      pts.push({ x, y, mal: x > trueX, d: x - trueX });
    }
    const flipped = new Set(), fixedSet = new Set();
    pts.forEach((p, i) => { if (p.mal && p.d < 14 && e.h(i * 11 + cyc) < 0.7) flipped.add(i); });
    const order = pts.map((p, i) => i).sort((a, b) => Math.abs(pts[a].d - 5) - Math.abs(pts[b].d - 5));
    const labelled = Math.max(0, mo - 1) * 6 + (mo >= 1 && ph > 0.66 ? 6 : 0);
    order.slice(0, labelled).forEach((i) => fixedSet.add(i));
    const poisonOn = mo >= 1;
    let wrong = 0;
    pts.forEach((p, i) => { if (poisonOn && flipped.has(i) && !fixedSet.has(i)) wrong++; });
    const shift = wrong * 0.55;
    e.box(X0, Y0 - 1, X1 - X0, Y1 - Y0 + 2, 's');
    for (let y = Y0; y < Y1; y++) {
      const bx = Math.round(30 + (y - 18) * 0.35 + shift);
      if (bx > X0 && bx < X1 - 1) e.P(bx, y, '|', 'i');
    }
    pts.forEach((p, i) => {
      const asGood = poisonOn && flipped.has(i) && !fixedSet.has(i);
      const sampled = fixedSet.has(i) && Math.floor(order.indexOf(i) / 6) === mo - 1 && ph > 0.66;
      e.P(p.x, p.y, p.mal ? '#' : '.', asGood ? 'b' : p.mal ? 'r' : 'a');
      if (sampled) { e.P(p.x - 1, p.y, '[', 'i'); e.P(p.x + 1, p.y, ']', 'i'); }
    });
    e.P(X0 + 2, Y1 + 1, '#  malware   .  goodware   #  label flipped', 'a');
    e.P(X0 + 29, Y1 + 1, '#', 'b');
    e.P(X0 + 2, Y1 + 2, '|  learned decision boundary', 'i');
    const steps = ['split in time', 'rebalance and poison', 'sample and retrain'];
    e.P(61, 5, 'month ' + Math.max(1, mo), 'b');
    steps.forEach((s, i) => {
      const on = mo >= 1 && Math.floor(ph * 3) === i;
      e.P(61, 8 + i * 2, (on ? '> ' : '  ') + s, on ? 'r' : 'a');
    });
    e.P(61, 16, 'label flips', 'a');
    e.P(73, 16, poisonOn ? String(flipped.size) : '0', 'r');
    e.P(61, 17, 'labelled by AL', 'a');
    e.P(77, 17, String(labelled), 'i');
    e.P(61, 18, 'still flipped', 'a');
    e.P(75, 18, String(wrong), wrong ? 'r' : 'i');
    e.P(61, 21, 'uncertainty sampling', 'a');
    e.P(61, 22, 'labels the apps closest', 'a');
    e.P(61, 23, 'to the boundary', 'a');
  },

};
