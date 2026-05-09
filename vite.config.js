import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/openagenda': {
        target: 'https://api.openagenda.com/v2',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openagenda/, ''),
      },
    },
  },
})
