import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './AuthContext.jsx'

// BrowserRouter로 앱 전체를 감싸야 페이지 이동(라우팅) 기능을 쓸 수 있음
// AuthProvider로 감싸야 어느 컴포넌트에서든 로그인 정보(useAuth)를 쓸 수 있음
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
