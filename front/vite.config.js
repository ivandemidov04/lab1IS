import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {///api -> on backend change api on v1
        target: 'http://localhost:8080', // Бэкенд-сервер
        changeOrigin: true, // Изменяет origin для кросс-доменных запросов
        rewrite: (path) => path.replace(/^\/api/, ''), // Переписывает путь, убирая /api
      },
    },
  },
  plugins: [react()],
})
