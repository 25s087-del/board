import { createContext, useContext, useState } from 'react'

// 로그인 정보를 앱 전체(헤더, 페이지들)에서 같이 쓰기 위한 Context
const AuthContext = createContext(null)

// 새로고침해도 로그인이 유지되도록 localStorage 에 저장된 사용자 정보를 처음 값으로 사용
function loadUser() {
  try {
    return JSON.parse(localStorage.getItem('user'))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser)

  // 로그인 성공 시: 토큰과 사용자 정보를 저장
  const login = (token, userInfo) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userInfo))
    setUser(userInfo)
  }

  // 로그아웃 시: 저장했던 것 모두 삭제
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

// 컴포넌트에서 const { user, login, logout } = useAuth() 로 꺼내 씀
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}
