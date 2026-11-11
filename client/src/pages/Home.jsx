import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import api, { getErrorMessage } from '../api.js'
import { useAuth } from '../AuthContext.jsx'
import { CATEGORIES } from '../constants.js'
import PostCard from '../components/PostCard.jsx'
import { ErrorText } from '../components/Form.jsx'
import { colors, radius, shadow, mobile } from '../styles/theme.js'

function Home() {
  const { user } = useAuth()
  const userId = user?.user_id
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || ''

  const [result, setResult] = useState({ category: null, posts: [], error: '' })

  useEffect(() => {
    api
      .get('/posts', { params: category ? { category } : {} })
      .then((res) => setResult({ category, posts: res.data, error: '' }))
      .catch((err) => setResult({ category, posts: [], error: getErrorMessage(err) }))
  }, [category, userId])

  const loading = result.category !== category
  const posts = loading ? [] : result.posts
  const error = loading ? '' : result.error

  const selectCategory = (c) => {
    setSearchParams(c ? { category: c } : {})
  }

  return (
    <div>
      <Hero>
        <h1>학급 게시판</h1>
        <p>공지, 수행평가, 분실물 소식까지 우리 학교 이야기를 한곳에서 확인하세요.</p>
      </Hero>

      <Toolbar>
        <Filters>
          <FilterChip $active={category === ''} onClick={() => selectCategory('')}>
            전체
          </FilterChip>
          {CATEGORIES.map((c) => (
            <FilterChip key={c} $active={category === c} onClick={() => selectCategory(c)}>
              {c}
            </FilterChip>
          ))}
        </Filters>
        {user && <WriteButton to="/posts/new">글쓰기</WriteButton>}
      </Toolbar>

      {error && <ErrorText>{error}</ErrorText>}
      {!error && loading && <Empty>불러오는 중...</Empty>}
      {!error && !loading && posts.length === 0 && (
        <Empty>
          <strong>아직 글이 없어요</strong>
          <span>{user ? '첫 번째 글을 남겨 보세요.' : '로그인하면 글을 쓸 수 있어요.'}</span>
        </Empty>
      )}

      <List>
        {posts.map((post) => (
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

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;

  ${mobile} {
    flex-direction: column-reverse;
    align-items: stretch;
  }
`

const Filters = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`

const FilterChip = styled.button`
  flex-shrink: 0;
  height: 36px;
  padding: 0 16px;
  border-radius: ${radius.chip};
  background: ${(p) => (p.$active ? colors.text : colors.surface)};
  color: ${(p) => (p.$active ? colors.white : colors.subText)};
  font-size: 14px;
  font-weight: 600;
  box-shadow: ${(p) => (p.$active ? 'none' : `inset 0 0 0 1px ${colors.border}`)};
  transition: background 0.15s, color 0.15s;

  &:hover {
    color: ${(p) => (p.$active ? colors.white : colors.text)};
  }
`

const WriteButton = styled(Link)`
  flex-shrink: 0;
  height: 40px;
  padding: 0 18px;
  border-radius: ${radius.control};
  background: ${colors.primary};
  color: ${colors.white};
  font-size: 14px;
  font-weight: 700;
  line-height: 40px;
  text-align: center;
  transition: background 0.15s;

  &:hover {
    background: ${colors.primaryHover};
  }

  ${mobile} {
    height: 44px;
    line-height: 44px;
  }
`

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Empty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
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

export default Home
