import { defineConfig } from 'astro/config';

const hashedNames = {
  name: 'hashed-names',
  hooks: {
    'astro:build:setup': ({ vite, target }) => {
      if (target !== 'client') return;
      const output = vite.build?.rollupOptions?.output;
      for (const o of [output].flat()) {
        if (!o) continue;
        o.entryFileNames = '_astro/[hash].js';
        o.chunkFileNames = '_astro/[hash].js';
        o.assetFileNames = '_astro/[hash][extname]';
      }
    },
  },
};

export default defineConfig({
  site: 'https://shaemcfadden.co.uk',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
  integrations: [hashedNames],
  vite: { build: { rollupOptions: { output: { assetFileNames: '_astro/[hash][extname]' } } } },
});
