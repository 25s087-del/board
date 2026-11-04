import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import api, { getErrorMessage } from '../api.js'
import { useAuth } from '../AuthContext.jsx'
import { formatDate } from '../constants.js'
import { ErrorText } from '../components/Form.jsx'

// 글 상세 화면: /posts/:id
function PostDetailPage() {
  const { id } = useParams() // 주소의 :id 부분
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
    if (!window.confirm('정말 이 글을 삭제할까요?')) return // 확인창에서 취소하면 중단
    try {
      await api.delete(`/posts/${id}`)
      navigate('/')
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  if (error && !post) return <ErrorText>{error}</ErrorText>
  if (!post) return <p>불러오는 중...</p>

  // 로그인한 사람이 이 글의 작성자인지
  const isMine = user && user.id === post.user_id

  return (
    <Box>
      {error && <ErrorText>{error}</ErrorText>}
      <Badge>{post.category}</Badge>
      <h2>{post.title}</h2>
      <Meta>
        {post.nickname}({post.grade}학년 {post.class_no}반) · 작성 {formatDate(post.created_at)}
        {post.updated_at !== post.created_at && ` · 수정 ${formatDate(post.updated_at)}`}
      </Meta>
      <Content>{post.content}</Content>

      <Buttons>
        <Button as={Link} to="/">목록</Button>
        {/* 본인 글일 때만 수정·삭제 버튼 보이기 */}
        {isMine && (
          <>
            <Button as={Link} to={`/posts/${id}/edit`}>수정</Button>
            <Button $danger onClick={handleDelete}>삭제</Button>
          </>
        )}
      </Buttons>
    </Box>
  )
}

const Box = styled.article`
  padding: 32px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Badge = styled.span`
  align-self: flex-start;
  padding: 2px 8px;
  border-radius: 4px;
  background: #eef3ff;
  color: #2f6fed;
  font-size: 12px;
  font-weight: bold;
`

const Meta = styled.p`
  font-size: 13px;
  color: #888;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
`

const Content = styled.div`
  min-height: 160px;
  line-height: 1.7;
  white-space: pre-wrap; /* 입력한 줄바꿈을 그대로 보여줌 */
  word-break: break-all;
`

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #eee;
`

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid ${(p) => (p.$danger ? '#d32f2f' : '#ccc')};
  color: ${(p) => (p.$danger ? '#d32f2f' : '#333')};
  background: #fff;
  font-size: 14px;
`

export default PostDetailPage
