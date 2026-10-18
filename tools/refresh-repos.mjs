import { readFileSync, writeFileSync } from 'node:fs';

const src = readFileSync(new URL('../src/data/repos.ts', import.meta.url), 'utf8');
const slugs = [...src.matchAll(/slug: '([^']+)'/g)].map((m) => m[1]);
const out = {};
for (const slug of slugs) {
  const res = await fetch(`https://api.github.com/repos/${slug}`, { headers: { accept: 'application/vnd.github+json' } });
  if (!res.ok) throw new Error(`${slug}: GitHub returned ${res.status}`);
  const d = await res.json();
  out[slug] = { language: d.language, stars: d.stargazers_count, forks: d.forks_count };
}
writeFileSync(new URL('../src/data/repo-stats.json', import.meta.url), JSON.stringify(out, null, 2) + '\n');
console.log(`Updated ${slugs.length} repositories.`);
