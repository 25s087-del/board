import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import styled from 'styled-components'
import api, { getErrorMessage } from '../api.js'
import { useAuth } from '../AuthContext.jsx'
import PostCard from '../components/PostCard.jsx'
import { ErrorText } from '../components/Form.jsx'
import { colors, radius, shadow, mobile } from '../styles/theme.js'

function ClassPage() {
  const { user } = useAuth()
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (!user) return
    api
      .get('/posts/my-class')
      .then((res) => setResult({ posts: res.data, error: '' }))
      .catch((err) => setResult({ posts: [], error: getErrorMessage(err) }))
  }, [user])

  if (!user) return <Navigate to="/login" replace />

  return (
    <div>
      <Hero>
        <h1>우리 반 글</h1>
        <p>
          {user.grade}학년 {user.class_no}반 친구들이 쓴 글이에요.
        </p>
      </Hero>

      {!result && <Empty>불러오는 중...</Empty>}
      {result?.error && <ErrorText>{result.error}</ErrorText>}
      {result && !result.error && result.posts.length === 0 && (
        <Empty>
          <strong>아직 우리 반 글이 없어요</strong>
        </Empty>
      )}

      <List>
        {result?.posts.map((post) => (
          <li key={post.id}>
            <PostCard post={post} />
          </li>
        ))}
      </List>
    </div>
  )
}

const Hero = styled.section`
  padding: 28px 4px 24px;

  h1 {
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 6px;
  }

  p {
    font-size: 15px;
    color: ${colors.subText};
  }

  ${mobile} {
    padding: 12px 0 18px;

    h1 {
      font-size: 24px;
    }
  }
`

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Empty = styled.div`
  padding: 56px 16px;
  background: ${colors.surface};
  border-radius: ${radius.card};
  box-shadow: ${shadow};
  color: ${colors.subText};
  font-size: 14px;
  text-align: center;

  strong {
    font-size: 17px;
    color: ${colors.text};
  }
`

export default ClassPage
