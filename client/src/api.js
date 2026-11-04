import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function getErrorMessage(err) {
  return err.response?.data?.message || '서버와 연결할 수 없습니다. 서버가 켜져 있는지 확인해 주세요.'
}

export default api
