import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    globals: true,
  },
  resolve: {
    alias: {
      '@anos/shared': path.resolve(__dirname, 'packages/shared/src'),
    },
  },
});
