import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from '../db.js'
import auth from '../middlewares/auth.js'

const router = Router()

// 학년(1~3)·반(1 이상 정수)이 올바른지 검사하는 함수
function isValidGradeClass(grade, class_no) {
  return (
    Number.isInteger(grade) && grade >= 1 && grade <= 3 &&
    Number.isInteger(class_no) && class_no >= 1 && class_no <= 20
  )
}

// ───────────────────────────────────────────
// 회원가입: POST /api/users/signup
// body: { email, password, nickname, grade, class_no }
// ───────────────────────────────────────────
router.post('/signup', async (req, res) => {
  const { email, password, nickname } = req.body
  const grade = Number(req.body.grade) // 화면에서 문자열로 와도 숫자로 바꿈
  const class_no = Number(req.body.class_no)

  // 1) 빈 값 검사
  if (!email || !password || !nickname) {
    return res.status(400).json({ message: '이메일, 비밀번호, 닉네임을 모두 입력해 주세요.' })
  }
  if (password.length < 4) {
    return res.status(400).json({ message: '비밀번호는 4자 이상이어야 합니다.' })
  }
  if (!isValidGradeClass(grade, class_no)) {
    return res.status(400).json({ message: '학년은 1~3, 반은 1~20 사이 숫자로 입력해 주세요.' })
  }

  try {
    // 2) 이메일 중복 검사 → 이미 있으면 409(Conflict)
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email])
    if (rows.length > 0) {
      return res.status(409).json({ message: '이미 가입된 이메일입니다.' })
    }

    // 3) 비밀번호 암호화 (10 = 암호화 반복 강도, 숫자가 클수록 안전하지만 느림)
    const hashed = await bcrypt.hash(password, 10)

    // 4) DB에 저장 (? 자리에 값을 넣는 방식이라 SQL 인젝션을 막아줌)
    const [result] = await pool.query(
      'INSERT INTO users (email, password, nickname, grade, class_no) VALUES (?, ?, ?, ?, ?)',
      [email, hashed, nickname, grade, class_no],
    )

    res.status(201).json({ message: '회원가입이 완료되었습니다.', id: result.insertId })
  } catch (err) {
    console.error('회원가입 오류:', err)
    res.status(500).json({ message: '서버 오류로 회원가입에 실패했습니다.' })
  }
})

// ───────────────────────────────────────────
// 로그인: POST /api/users/login
// body: { email, password } → 성공하면 JWT 토큰과 사용자 정보 반환
// ───────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: '이메일과 비밀번호를 입력해 주세요.' })
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
    const user = rows[0]

    // 이메일이 없거나 비밀번호가 틀리면 같은 메시지 (어느 쪽이 틀렸는지 알려주지 않는 게 보안상 안전)
    // bcrypt.compare: 입력한 비밀번호를 암호화해서 DB의 암호화된 값과 비교
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' })
    }

    // 토큰 안에 넣을 정보 (비밀번호는 절대 넣지 않음)
    const info = {
      id: user.id,
      nickname: user.nickname,
      grade: user.grade,
      class_no: user.class_no,
    }
    // JWT_SECRET 으로 서명한 토큰 발급, 1일 뒤 만료
    const token = jwt.sign(info, process.env.JWT_SECRET, { expiresIn: '1d' })

    res.json({ message: '로그인 성공', token, user: info })
  } catch (err) {
    console.error('로그인 오류:', err)
    res.status(500).json({ message: '서버 오류로 로그인에 실패했습니다.' })
  }
})

// ───────────────────────────────────────────
// 내 정보: GET /api/users/me  (auth 미들웨어가 먼저 토큰 검사)
// ───────────────────────────────────────────
router.get('/me', auth, async (req, res) => {
  try {
    // 비밀번호 컬럼은 빼고 조회
    const [rows] = await pool.query(
      'SELECT id, email, nickname, grade, class_no, created_at, updated_at FROM users WHERE id = ?',
      [req.user.id],
    )
    if (rows.length === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' })
    }
    res.json(rows[0])
  } catch (err) {
    console.error('내 정보 조회 오류:', err)
    res.status(500).json({ message: '서버 오류로 정보를 불러오지 못했습니다.' })
  }
})

export default router
