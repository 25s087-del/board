import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

function loadUser() {
  try {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user?.user_id) return user
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser)

  const login = (token, userInfo) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userInfo))
    setUser(userInfo)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}
