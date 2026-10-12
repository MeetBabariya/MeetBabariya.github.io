// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://meetbabariya.github.io',
  integrations: [mdx(), sitemap({ filter: (page) => !page.endsWith('/og/') })],
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  build: { inlineStylesheets: 'auto' },
  devToolbar: { enabled: false },
});
