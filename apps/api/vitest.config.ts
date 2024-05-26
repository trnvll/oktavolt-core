import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: './test/_utils/global-setup.utils.ts',
    testTimeout: 10_000,
    globals: true,
    alias: {
      '@': './src',
    },
    root: './',
  },
  resolve: {
    alias: {
      '@': './src',
    },
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
})
