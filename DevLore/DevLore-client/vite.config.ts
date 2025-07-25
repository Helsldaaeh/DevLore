import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host:"0.0.0.0",
    proxy: {
      '/api': {
        target: 'http://devloreapi:8080',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  }
})