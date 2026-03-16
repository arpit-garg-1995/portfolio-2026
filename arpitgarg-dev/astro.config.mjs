import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://arpitgarg.dev',   // ← change to https://arpitgarg.com once domain is live
  output: 'static',
  integrations: [preact(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark'
    }
  }
});
