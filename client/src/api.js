import axios from 'axios'

// 이 프로젝트에서 쓰는 axios (모든 요청 주소 앞에 /api 가 붙음)
const api = axios.create({ baseURL: '/api' })

// 요청을 보내기 직전에 실행됨: localStorage 에 토큰이 있으면 헤더에 자동으로 붙임
// → 로그인이 필요한 API 를 부를 때마다 직접 헤더를 쓰지 않아도 됨
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 서버가 보낸 에러 메시지를 꺼내는 함수 (없으면 기본 메시지)
export function getErrorMessage(err) {
  return err.response?.data?.message || '서버와 연결할 수 없습니다. 서버가 켜져 있는지 확인해 주세요.'
}

export default api
