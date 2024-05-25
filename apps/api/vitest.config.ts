import { defineConfig } from 'vitest/config'
import viteTsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [viteTsconfigPaths()],
  test: {
    testTimeout: 30_000,
  },
})
