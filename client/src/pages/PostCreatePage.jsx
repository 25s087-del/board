import { Navigate, useNavigate } from 'react-router-dom'
import api from '../api.js'
import { useAuth } from '../AuthContext.jsx'
import PostForm from '../components/PostForm.jsx'

function PostCreatePage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) return <Navigate to="/login" replace />

  const handleSubmit = async (form) => {
    const res = await api.post('/posts', form)
    navigate(`/posts/${res.data.id}`)
  }

  return <PostForm title="글쓰기" submitText="등록" onSubmit={handleSubmit} />
}

export default PostCreatePage
