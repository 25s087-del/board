import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import api, { getErrorMessage } from '../api.js'
import { useAuth } from '../AuthContext.jsx'
import { formatDate } from '../constants.js'
import { ErrorText, Button } from '../components/Form.jsx'
import CategoryChip from '../components/CategoryChip.jsx'
import { colors, radius, shadow, mobile } from '../styles/theme.js'

function PostDetailPage() {
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

  const handleDelete = async () => {
    if (!window.confirm('정말 이 글을 삭제할까요?')) return
    try {
      await api.delete(`/posts/${id}`)
      navigate('/')
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  if (error && !post) return <ErrorText>{error}</ErrorText>
  if (!post) return <p>불러오는 중...</p>

  const isMine = user && user.id === post.user_id

  return (
    <Box>
      {error && <ErrorText>{error}</ErrorText>}
      <CategoryChip category={post.category} />
      <h2>{post.title}</h2>
      <Meta>
        {post.nickname}({post.grade}학년 {post.class_no}반) · 작성 {formatDate(post.created_at)}
        {post.updated_at !== post.created_at && ` · 수정 ${formatDate(post.updated_at)}`}
      </Meta>
      <Content>{post.content}</Content>

      <Buttons>
        <Button as={Link} to="/">목록</Button>
        {isMine && (
          <>
            <Button as={Link} to={`/posts/${id}/edit`}>수정</Button>
            <Button $variant="danger" onClick={handleDelete}>삭제</Button>
          </>
        )}
      </Buttons>
    </Box>
  )
}

const Box = styled.article`
  max-width: 720px;
  margin: 0 auto;
  padding: 32px;
  background: ${colors.surface};
  border-radius: ${radius.card};
  box-shadow: ${shadow};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;

  h2 {
    font-size: 24px;
    font-weight: 700;
    line-height: 1.4;
    word-break: break-all;
  }

  ${mobile} {
    padding: 24px 20px;

    h2 {
      font-size: 21px;
    }
  }
`

const Meta = styled.p`
  width: 100%;
  padding-bottom: 16px;
  border-bottom: 1px solid ${colors.border};
  font-size: 14px;
  color: ${colors.subText};
`

const Content = styled.div`
  width: 100%;
  min-height: 160px;
  padding: 8px 0;
  font-size: 16px;
  line-height: 1.75;
  white-space: pre-wrap;
  word-break: break-all;
`

const Buttons = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid ${colors.border};
`

export default PostDetailPage
