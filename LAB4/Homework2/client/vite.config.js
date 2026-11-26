import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [react()],

  envDir: fileURLToPath(
    new URL('..', import.meta.url)
  ),

  server: {
    port: 5173,
    strictPort: true,
  },

  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    globals: false,
    css: true,

    pool: 'threads',
    maxWorkers: 1,
    fileParallelism: false,
    isolate: true,
  },
})