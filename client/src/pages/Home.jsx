import { useEffect, useState } from 'react'
import axios from 'axios'

// 1단계 확인용 홈 화면: 서버 /api/health 응답을 보여줌
function Home() {
  const [status, setStatus] = useState('서버 확인 중...')

  useEffect(() => {
    axios
      .get('/api/health') // vite 프록시 덕분에 localhost:5000/api/health 로 전달됨
      .then((res) => setStatus(res.data.message))
      .catch(() => setStatus('서버 연결 실패 (server를 실행했는지 확인)'))
  }, [])

  return (
    <div>
      <h1>홈</h1>
      <p>서버 상태: {status}</p>
    </div>
  )
}

export default Home
