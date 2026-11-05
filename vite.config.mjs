import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  base: '/cubejs-dashboard/',
  optimizeDeps: {rolldownOptions:{moduleTypes:{'.js':'jsx'}}},
  resolve: { alias: { "actions": fileURLToPath(new URL('./src/actions', import.meta.url)), "components": fileURLToPath(new URL('./src/components', import.meta.url)), "config": fileURLToPath(new URL('./src/config', import.meta.url)), "pages": fileURLToPath(new URL('./src/pages', import.meta.url)), "reducers": fileURLToPath(new URL('./src/reducers', import.meta.url)) } },
  plugins: [
    {
      name: 'source-jsx',
      enforce: 'pre',
      async transform(code, id) {
        if (/\/src\/.*\.js$/.test(id)) {
          return transformWithEsbuild(code, id, { loader: 'jsx', jsx: 'transform' });
        }
      },
    },
    react({ jsxRuntime: 'classic' }),
  ],
  define: { global: 'globalThis', 'process.env': JSON.stringify({ ...loadEnv(mode, process.cwd(), 'REACT_APP_'), NODE_ENV: mode, PUBLIC_URL: '' }) },
  css: {preprocessorOptions:{scss:{silenceDeprecations:['import','global-builtin','color-functions','slash-div','if-function']}}},
  build: {outDir:'build'},
}));
