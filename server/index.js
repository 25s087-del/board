import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import './db.js' // 불러오는 순간 DB 연결 확인 로그가 찍힘
import usersRouter from './routes/users.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors()) // 다른 주소(클라이언트)에서 오는 요청 허용
app.use(express.json()) // 요청 body의 JSON을 req.body 로 읽을 수 있게 함

// 서버가 살아있는지 확인하는 주소
app.get('/api/health', (req, res) => {
  res.json({ message: '서버 정상 동작 중' })
})

// /api/users 로 시작하는 요청은 routes/users.js 에서 처리 (회원가입, 로그인, 내 정보)
app.use('/api/users', usersRouter)

app.listen(PORT, () => {
  console.log(`🚀 서버 실행: http://localhost:${PORT}`)
})
