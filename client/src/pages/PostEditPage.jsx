import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import api, { getErrorMessage } from '../api.js'
import { useAuth } from '../AuthContext.jsx'
import PostForm from '../components/PostForm.jsx'
import { ErrorText } from '../components/Form.jsx'

function PostEditPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get(`/posts/${id}`)
      .then((res) => setPost(res.data))
      .catch((err) => setError(getErrorMessage(err)))
  }, [id])

  if (!user) return <Navigate to="/login" replace />
  if (error) return <ErrorText>{error}</ErrorText>
  if (!post) return <p>불러오는 중...</p>
  if (post.user_id !== user.id) return <ErrorText>본인이 쓴 글만 수정할 수 있습니다.</ErrorText>

  const handleSubmit = async (form) => {
    await api.put(`/posts/${id}`, form)
    navigate(`/posts/${id}`)
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
