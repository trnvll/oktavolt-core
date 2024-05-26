import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: './test/_setup/global.setup.ts',
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
