import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from '../db.js'
import auth from '../middlewares/auth.js'

const router = Router()

function isValidGradeClass(grade, class_no) {
  return (
    Number.isInteger(grade) && grade >= 1 && grade <= 3 &&
    Number.isInteger(class_no) && class_no >= 1 && class_no <= 20
  )
}

function issueToken(user) {
  const info = {
    id: user.id,
    nickname: user.nickname,
    grade: user.grade,
    class_no: user.class_no,
  }
  const token = jwt.sign(info, process.env.JWT_SECRET, { expiresIn: '1d' })
  return { token, user: info }
}

router.post('/signup', async (req, res) => {
  const { email, password, nickname } = req.body
  const grade = Number(req.body.grade)
  const class_no = Number(req.body.class_no)

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
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email])
    if (rows.length > 0) {
      return res.status(409).json({ message: '이미 가입된 이메일입니다.' })
    }

    const hashed = await bcrypt.hash(password, 10)

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

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: '이메일과 비밀번호를 입력해 주세요.' })
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
    const user = rows[0]

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' })
    }

    res.json({ message: '로그인 성공', ...issueToken(user) })
  } catch (err) {
    console.error('로그인 오류:', err)
    res.status(500).json({ message: '서버 오류로 로그인에 실패했습니다.' })
  }
})

router.get('/me', auth, async (req, res) => {
  try {
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

router.put('/me', auth, async (req, res) => {
  const { nickname, password } = req.body
  const grade = Number(req.body.grade)
  const class_no = Number(req.body.class_no)

  if (!nickname?.trim()) {
    return res.status(400).json({ message: '닉네임을 입력해 주세요.' })
  }
  if (!isValidGradeClass(grade, class_no)) {
    return res.status(400).json({ message: '학년은 1~3, 반은 1~20 사이 숫자로 입력해 주세요.' })
  }
  if (password && password.length < 4) {
    return res.status(400).json({ message: '비밀번호는 4자 이상이어야 합니다.' })
  }

  try {
    if (password) {
      const hashed = await bcrypt.hash(password, 10)
      await pool.query(
        'UPDATE users SET nickname = ?, grade = ?, class_no = ?, password = ? WHERE id = ?',
        [nickname.trim(), grade, class_no, hashed, req.user.id],
      )
    } else {
      await pool.query(
        'UPDATE users SET nickname = ?, grade = ?, class_no = ? WHERE id = ?',
        [nickname.trim(), grade, class_no, req.user.id],
      )
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id])
    if (rows.length === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' })
    }
    res.json({ message: '내 정보가 수정되었습니다.', ...issueToken(rows[0]) })
  } catch (err) {
    console.error('내 정보 수정 오류:', err)
    res.status(500).json({ message: '서버 오류로 정보를 수정하지 못했습니다.' })
  }
})

router.delete('/me', auth, async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.user.id])
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' })
    }
    res.json({ message: '회원 탈퇴가 완료되었습니다.' })
  } catch (err) {
    console.error('회원 탈퇴 오류:', err)
    res.status(500).json({ message: '서버 오류로 탈퇴하지 못했습니다.' })
  }
})

export default router
