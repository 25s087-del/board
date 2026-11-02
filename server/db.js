import mysql from 'mysql2/promise'
import 'dotenv/config' // .env 파일의 값을 process.env 로 불러옴

// 커넥션 풀: DB 연결을 여러 개 미리 만들어 두고 돌려쓰는 방식
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true, // 날짜를 'YYYY-MM-DD HH:mm:ss' 문자열로 받기
})

// 서버 시작 시 DB 연결이 되는지 한 번 확인해서 로그 출력
try {
  const conn = await pool.getConnection()
  console.log(`✅ DB 연결 성공 (${process.env.DB_HOST} / ${process.env.DB_NAME})`)
  conn.release() // 확인용으로 빌린 연결은 반납
} catch (err) {
  console.error('❌ DB 연결 실패:', err.message)
}

export default pool
