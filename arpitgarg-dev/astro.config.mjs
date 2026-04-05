import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: 'https://arpitgarg.pages.dev',
  output: 'static',
  integrations: [sitemap()],

  markdown: {
    shikiConfig: {
      theme: 'github-dark'
    }
  },

  adapter: cloudflare()
});