/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), visualizer({
    filename: './dist/stats.html',
    open: false,
  }),],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
  },
})
