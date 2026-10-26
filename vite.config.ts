import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { business } from './src/content';

export default defineConfig(({ mode }) => {
  const netlify = mode === 'netlify' || process.env.NETLIFY === 'true';
  return {
    plugins: [
      react(),
      {
        name: 'ecomlik-deployment-info',
        generateBundle() {
          this.emitFile({
            type: 'asset',
            fileName: 'deployment.json',
            source: JSON.stringify(
              {
                release: 'forms-error-recovery-v3',
                leadProvider: netlify ? 'netlify_forms' : 'node_api',
                defaultGaMeasurementId: business.gaId,
                orderPath: '/order',
                commit: process.env.COMMIT_REF || null,
              },
              null,
              2,
            ),
          });
        },
      },
    ],
    define: { 'import.meta.env.VITE_LEAD_PROVIDER': JSON.stringify(netlify ? 'netlify' : 'api') },
    build: { target: 'es2022' },
  };
});
