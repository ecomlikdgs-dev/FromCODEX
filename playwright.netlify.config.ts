import { defineConfig } from '@playwright/test';
import base from './playwright.config';

export default defineConfig({
  ...base,
  testDir: './tests/netlify',
  use: { ...base.use, baseURL: 'http://127.0.0.1:4174' },
  webServer: {
    command: 'npm run preview:netlify',
    url: 'http://127.0.0.1:4174',
    reuseExistingServer: false,
  },
});
