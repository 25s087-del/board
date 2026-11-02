import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // /api 로 시작하는 요청은 Express 서버(5000번 포트)로 전달
    // → 클라이언트에서 axios.get('/api/...') 처럼 짧게 쓸 수 있고 CORS 문제도 피함
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})
