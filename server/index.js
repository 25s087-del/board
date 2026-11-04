import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import './db.js'
import usersRouter from './routes/users.js'
import postsRouter from './routes/posts.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ message: '서버 정상 동작 중' })
})

app.use('/api/users', usersRouter)
app.use('/api/posts', postsRouter)

app.listen(PORT, () => {
  console.log(`🚀 서버 실행: http://localhost:${PORT}`)
})
