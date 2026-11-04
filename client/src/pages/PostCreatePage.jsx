import { Navigate, useNavigate } from 'react-router-dom'
import api from '../api.js'
import { useAuth } from '../AuthContext.jsx'
import PostForm from '../components/PostForm.jsx'

// 글쓰기 화면: /posts/new
function PostCreatePage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // 로그인 안 한 상태로 주소를 직접 치고 들어오면 로그인 페이지로 보냄
  if (!user) return <Navigate to="/login" replace />

  // 실패하면 에러가 PostForm 으로 전달되어 화면에 메시지가 표시됨
  const handleSubmit = async (form) => {
    const res = await api.post('/posts', form)
    navigate(`/posts/${res.data.id}`) // 등록한 글의 상세 화면으로 이동
  }

  return <PostForm title="글쓰기" submitText="등록" onSubmit={handleSubmit} />
}

export default PostCreatePage
