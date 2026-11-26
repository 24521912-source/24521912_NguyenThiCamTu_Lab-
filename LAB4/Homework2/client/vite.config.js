import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    globals: false,
    css: true,

    // Reduce memory pressure during regression tests.
    pool: 'threads',
    maxWorkers: 1,
    fileParallelism: false,
    isolate: true,
  },
})