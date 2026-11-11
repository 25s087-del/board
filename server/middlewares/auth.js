import jwt from 'jsonwebtoken'

function auth(req, res, next) {
  const header = req.headers.authorization || ''
  const [type, token] = header.split(' ')

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ message: '로그인이 필요합니다.' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    if (!payload.user_id) throw new Error('invalid token')
    req.user = payload
    next()
  } catch {
    return res.status(401).json({ message: '로그인이 만료되었습니다. 다시 로그인해 주세요.' })
  }
}

export function optionalAuth(req, res, next) {
  const [type, token] = (req.headers.authorization || '').split(' ')
  if (type === 'Bearer' && token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET)
      req.user = payload.user_id ? payload : undefined
    } catch {
      req.user = undefined
    }
  }
  next()
}

export default auth
