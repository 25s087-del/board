import jwt from 'jsonwebtoken'

// 로그인이 필요한 API 앞에 끼워 넣는 미들웨어
// 요청 헤더 "Authorization: Bearer 토큰" 을 검사해서
// 올바른 토큰이면 req.user 에 사용자 정보를 넣고 다음 단계(next)로 보냄
function auth(req, res, next) {
  const header = req.headers.authorization || ''
  const [type, token] = header.split(' ') // "Bearer abc.def.ghi" → ["Bearer", "abc.def.ghi"]

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ message: '로그인이 필요합니다.' })
  }

  try {
    // 토큰이 위조됐거나 만료됐으면 여기서 에러가 남
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = payload // { id, nickname, grade, class_no, iat, exp }
    next()
  } catch {
    return res.status(401).json({ message: '로그인이 만료되었습니다. 다시 로그인해 주세요.' })
  }
}

export default auth
