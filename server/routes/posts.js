import { Router } from 'express'
import pool from '../db.js'
import auth from '../middlewares/auth.js'

const router = Router()

// DB의 ENUM 과 똑같이 맞춘 카테고리 목록
const CATEGORIES = ['공지', '수행평가', '자유', '분실물']

// 글 목록·상세에서 같이 쓰는 SELECT 문
// posts(p) 와 users(u) 를 JOIN 해서 작성자 닉네임·학년·반을 함께 가져옴
const SELECT_POST = `
  SELECT p.id, p.user_id, p.category, p.title, p.content, p.created_at, p.updated_at,
         u.nickname, u.grade, u.class_no
  FROM posts p
  JOIN users u ON p.user_id = u.id
`

// 제목·내용·카테고리 검사 (문제가 있으면 에러 메시지, 없으면 null 반환)
function validatePost({ title, content, category }) {
  if (!title?.trim() || !content?.trim()) return '제목과 내용을 입력해 주세요.'
  if (title.length > 200) return '제목은 200자 이하로 입력해 주세요.'
  if (!CATEGORIES.includes(category)) return '카테고리를 올바르게 선택해 주세요.'
  return null
}

// ───────────────────────────────────────────
// 글 목록: GET /api/posts  (누구나)
// ?category=자유 처럼 보내면 해당 카테고리만
// ───────────────────────────────────────────
router.get('/', async (req, res) => {
  const { category } = req.query
  try {
    let sql = SELECT_POST
    const params = []
    if (category) {
      if (!CATEGORIES.includes(category)) {
        return res.status(400).json({ message: '없는 카테고리입니다.' })
      }
      sql += ' WHERE p.category = ?'
      params.push(category)
    }
    sql += ' ORDER BY p.id DESC' // 최신 글이 위로

    const [rows] = await pool.query(sql, params)
    res.json(rows)
  } catch (err) {
    console.error('글 목록 오류:', err)
    res.status(500).json({ message: '서버 오류로 글 목록을 불러오지 못했습니다.' })
  }
})

// ───────────────────────────────────────────
// 글 상세: GET /api/posts/:id  (누구나)
// ───────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(SELECT_POST + ' WHERE p.id = ?', [req.params.id])
    if (rows.length === 0) {
      return res.status(404).json({ message: '글을 찾을 수 없습니다.' })
    }
    res.json(rows[0])
  } catch (err) {
    console.error('글 상세 오류:', err)
    res.status(500).json({ message: '서버 오류로 글을 불러오지 못했습니다.' })
  }
})

// ───────────────────────────────────────────
// 글 작성: POST /api/posts  (로그인 필요)
// body: { title, content, category }
// ───────────────────────────────────────────
router.post('/', auth, async (req, res) => {
  const error = validatePost(req.body)
  if (error) return res.status(400).json({ message: error })

  const { title, content, category } = req.body
  try {
    // 작성자는 body 가 아니라 토큰(req.user)에서 가져옴 → 남의 이름으로 글을 쓸 수 없음
    const [result] = await pool.query(
      'INSERT INTO posts (user_id, category, title, content) VALUES (?, ?, ?, ?)',
      [req.user.id, category, title.trim(), content],
    )
    res.status(201).json({ message: '글이 등록되었습니다.', id: result.insertId })
  } catch (err) {
    console.error('글 작성 오류:', err)
    res.status(500).json({ message: '서버 오류로 글을 등록하지 못했습니다.' })
  }
})

// 글이 있는지, 내 글인지 확인하는 함수 (수정·삭제에서 같이 사용)
// 문제가 있으면 응답을 보내고 false, 통과하면 true 반환
async function checkOwner(req, res) {
  const [rows] = await pool.query('SELECT user_id FROM posts WHERE id = ?', [req.params.id])
  if (rows.length === 0) {
    res.status(404).json({ message: '글을 찾을 수 없습니다.' })
    return false
  }
  // 서버에서도 작성자 검사: 화면에서 버튼을 숨겨도 주소로 직접 요청할 수 있기 때문
  if (rows[0].user_id !== req.user.id) {
    res.status(403).json({ message: '본인이 쓴 글만 수정·삭제할 수 있습니다.' })
    return false
  }
  return true
}

// ───────────────────────────────────────────
// 글 수정: PUT /api/posts/:id  (로그인 + 본인 글)
// ───────────────────────────────────────────
router.put('/:id', auth, async (req, res) => {
  const error = validatePost(req.body)
  if (error) return res.status(400).json({ message: error })

  const { title, content, category } = req.body
  try {
    if (!(await checkOwner(req, res))) return
    await pool.query(
      'UPDATE posts SET category = ?, title = ?, content = ? WHERE id = ?',
      [category, title.trim(), content, req.params.id],
    )
    res.json({ message: '글이 수정되었습니다.' })
  } catch (err) {
    console.error('글 수정 오류:', err)
    res.status(500).json({ message: '서버 오류로 글을 수정하지 못했습니다.' })
  }
})

// ───────────────────────────────────────────
// 글 삭제: DELETE /api/posts/:id  (로그인 + 본인 글)
// ───────────────────────────────────────────
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!(await checkOwner(req, res))) return
    await pool.query('DELETE FROM posts WHERE id = ?', [req.params.id])
    res.json({ message: '글이 삭제되었습니다.' })
  } catch (err) {
    console.error('글 삭제 오류:', err)
    res.status(500).json({ message: '서버 오류로 글을 삭제하지 못했습니다.' })
  }
})

export default router
