import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import api, { getErrorMessage } from '../api.js'
import { useAuth } from '../AuthContext.jsx'
import PostForm from '../components/PostForm.jsx'
import { ErrorText } from '../components/Form.jsx'

// 글 수정 화면: /posts/:id/edit
function PostEditPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [error, setError] = useState('')

  // 기존 글 내용을 불러와서 폼에 채워 넣기
  useEffect(() => {
    api
      .get(`/posts/${id}`)
      .then((res) => setPost(res.data))
      .catch((err) => setError(getErrorMessage(err)))
  }, [id])

  if (!user) return <Navigate to="/login" replace />
  if (error) return <ErrorText>{error}</ErrorText>
  if (!post) return <p>불러오는 중...</p>
  // 남의 글 수정 주소로 직접 들어온 경우 (서버에서도 403으로 막음)
  if (post.user_id !== user.id) return <ErrorText>본인이 쓴 글만 수정할 수 있습니다.</ErrorText>

  // 실패하면 에러가 PostForm 으로 전달되어 화면에 메시지가 표시됨
  const handleSubmit = async (form) => {
    await api.put(`/posts/${id}`, form)
    navigate(`/posts/${id}`) // 수정 후 상세 화면으로
  }

  return (
    <PostForm
      title="글 수정"
      submitText="수정 완료"
      initial={{ category: post.category, title: post.title, content: post.content }}
      onSubmit={handleSubmit}
    />
  )
}

export default PostEditPage
