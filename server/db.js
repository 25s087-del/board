import mysql from 'mysql2/promise'
import 'dotenv/config'

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true,
})

try {
  const conn = await pool.getConnection()
  console.log(`✅ DB 연결 성공 (${process.env.DB_HOST} / ${process.env.DB_NAME})`)
  conn.release()
} catch (err) {
  console.error('❌ DB 연결 실패:', err.message)
}

export default pool
