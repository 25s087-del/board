import { Router } from 'express'
import pool from '../db.js'
import auth, { optionalAuth } from '../middlewares/auth.js'

const router = Router()

const CATEGORIES = ['공지', '수행평가', '자유', '분실물']

const SELECT_POST = `
  SELECT p.id, p.user_id, p.category, p.title, p.content, p.is_anonymous, p.created_at, p.updated_at,
         u.nickname, u.grade, u.class_no
  FROM posts p
  JOIN users u ON p.user_id = u.user_id
`

function toResponse(post, viewer) {
  const isAnonymous = Boolean(post.is_anonymous)
  const result = {
    ...post,
    is_anonymous: isAnonymous,
    is_mine: Boolean(viewer) && post.user_id === viewer.user_id,
  }
  if (isAnonymous) {
    delete result.user_id
    delete result.nickname
    delete result.grade
    delete result.class_no
  }
  return result
}

function validatePost({ title, content, category }) {
  if (!title?.trim() || !content?.trim()) return '제목과 내용을 입력해 주세요.'
  if (title.length > 200) return '제목은 200자 이하로 입력해 주세요.'
  if (!CATEGORIES.includes(category)) return '카테고리를 올바르게 선택해 주세요.'
  return null
}

router.get('/', optionalAuth, async (req, res) => {
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
    sql += ' ORDER BY p.id DESC'

    const [rows] = await pool.query(sql, params)
    res.json(rows.map((post) => toResponse(post, req.user)))
  } catch (err) {
    console.error('글 목록 오류:', err)
    res.status(500).json({ message: '서버 오류로 글 목록을 불러오지 못했습니다.' })
  }
})

router.get('/my-class', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      SELECT_POST +
        ` JOIN users me ON me.user_id = ?
          WHERE u.grade = me.grade AND u.class_no = me.class_no
          ORDER BY p.id DESC`,
      [req.user.user_id],
    )
    res.json(rows.map((post) => toResponse(post, req.user)))
  } catch (err) {
    console.error('우리 반 글 오류:', err)
    res.status(500).json({ message: '서버 오류로 우리 반 글을 불러오지 못했습니다.' })
  }
})

router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(SELECT_POST + ' WHERE p.id = ?', [req.params.id])
    if (rows.length === 0) {
      return res.status(404).json({ message: '글을 찾을 수 없습니다.' })
    }
    res.json(toResponse(rows[0], req.user))
  } catch (err) {
    console.error('글 상세 오류:', err)
    res.status(500).json({ message: '서버 오류로 글을 불러오지 못했습니다.' })
  }
})

router.post('/', auth, async (req, res) => {
  const error = validatePost(req.body)
  if (error) return res.status(400).json({ message: error })

  const { title, content, category } = req.body
  const isAnonymous = req.body.is_anonymous ? 1 : 0
  try {
    const [result] = await pool.query(
      'INSERT INTO posts (user_id, category, title, content, is_anonymous) VALUES (?, ?, ?, ?, ?)',
      [req.user.user_id, category, title.trim(), content, isAnonymous],
    )
    res.status(201).json({ message: '글이 등록되었습니다.', id: result.insertId })
  } catch (err) {
    console.error('글 작성 오류:', err)
    res.status(500).json({ message: '서버 오류로 글을 등록하지 못했습니다.' })
  }
})

async function checkOwner(req, res) {
  const [rows] = await pool.query('SELECT user_id FROM posts WHERE id = ?', [req.params.id])
  if (rows.length === 0) {
    res.status(404).json({ message: '글을 찾을 수 없습니다.' })
    return false
  }
  if (rows[0].user_id !== req.user.user_id) {
    res.status(403).json({ message: '본인이 쓴 글만 수정·삭제할 수 있습니다.' })
    return false
  }
  return true
}

router.put('/:id', auth, async (req, res) => {
  const error = validatePost(req.body)
  if (error) return res.status(400).json({ message: error })

  const { title, content, category } = req.body
  const isAnonymous = req.body.is_anonymous ? 1 : 0
  try {
    if (!(await checkOwner(req, res))) return
    await pool.query(
      'UPDATE posts SET category = ?, title = ?, content = ?, is_anonymous = ? WHERE id = ?',
      [category, title.trim(), content, isAnonymous, req.params.id],
    )
    res.json({ message: '글이 수정되었습니다.' })
  } catch (err) {
    console.error('글 수정 오류:', err)
    res.status(500).json({ message: '서버 오류로 글을 수정하지 못했습니다.' })
  }
})

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
