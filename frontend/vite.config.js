import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy API calls tới Spring Boot trong dev mode
      '/api': {
        target: 'http://127.0.0.1:8081',
        changeOrigin: true,
      }
    }
  }
})
