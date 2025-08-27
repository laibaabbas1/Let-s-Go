import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Iska matlab hai ke '/api' se shuru hone wali har request ko
      // 'http://localhost:5000' par bhej do
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    }
  }
})