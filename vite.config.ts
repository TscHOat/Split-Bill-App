import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    open: false,
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'mui': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'redux': ['@reduxjs/toolkit', 'react-redux'],
        },
      },
    },
  },
  preview: {
    port: 4173,
  },
})
