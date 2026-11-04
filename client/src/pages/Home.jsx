import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import api, { getErrorMessage } from '../api.js'
import { useAuth } from '../AuthContext.jsx'
import { CATEGORIES, formatDate } from '../constants.js'

// 메인 화면: 전체 글 목록 + 카테고리 필터
function Home() {
  const { user } = useAuth()
  // 선택한 카테고리를 주소(?category=자유)에 저장 → 새로고침·뒤로가기해도 유지됨
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || '' // '' = 전체

  // 서버에서 받은 결과를 "어느 카테고리의 결과인지"와 함께 저장
  const [result, setResult] = useState({ category: null, posts: [], error: '' })

  // 카테고리가 바뀔 때마다 목록을 다시 불러옴
  useEffect(() => {
    api
      .get('/posts', { params: category ? { category } : {} })
      .then((res) => setResult({ category, posts: res.data, error: '' }))
      .catch((err) => setResult({ category, posts: [], error: getErrorMessage(err) }))
  }, [category])

  // 저장된 결과가 지금 선택한 카테고리 것이 아니면 아직 불러오는 중
  const loading = result.category !== category
  const posts = loading ? [] : result.posts
  const error = loading ? '' : result.error

  const selectCategory = (c) => {
    setSearchParams(c ? { category: c } : {})
  }

  return (
    <div>
      <Top>
        <h2>{category || '전체'} 글</h2>
        {/* 로그인한 사람에게만 글쓰기 버튼 보이기 */}
        {user && <WriteButton to="/posts/new">글쓰기</WriteButton>}
      </Top>

      <Filters>
        <FilterButton $active={category === ''} onClick={() => selectCategory('')}>
          전체
        </FilterButton>
        {CATEGORIES.map((c) => (
          <FilterButton key={c} $active={category === c} onClick={() => selectCategory(c)}>
            {c}
          </FilterButton>
        ))}
      </Filters>

      {error && <Message $error>{error}</Message>}
      {!error && loading && <Message>불러오는 중...</Message>}
      {!error && !loading && posts.length === 0 && <Message>아직 글이 없습니다.</Message>}

      <List>
        {posts.map((post) => (
          <Item key={post.id}>
            <Link to={`/posts/${post.id}`}>
              <Badge>{post.category}</Badge>
              <Title>{post.title}</Title>
              <Meta>
                {post.nickname}({post.grade}학년 {post.class_no}반) · {formatDate(post.created_at)}
              </Meta>
            </Link>
          </Item>
        ))}
      </List>
    </div>
  )
}

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`

const WriteButton = styled(Link)`
  padding: 8px 16px;
  border-radius: 4px;
  background: #2f6fed;
  color: #fff;
  font-weight: bold;
`

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`

// $active: 선택된 버튼이면 파란색 (styled-components 에서 $ 붙은 props 는 화면 태그로 넘어가지 않음)
const FilterButton = styled.button`
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid ${(p) => (p.$active ? '#2f6fed' : '#ccc')};
  background: ${(p) => (p.$active ? '#2f6fed' : '#fff')};
  color: ${(p) => (p.$active ? '#fff' : '#333')};
  font-size: 14px;
`

const List = styled.ul`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;

  &:empty {
    display: none;
  }
`

const Item = styled.li`
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }

  a {
    display: block;
    padding: 14px 18px;
  }

  a:hover {
    background: #f4f7ff;
  }
`

const Badge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  margin-right: 8px;
  border-radius: 4px;
  background: #eef3ff;
  color: #2f6fed;
  font-size: 12px;
  font-weight: bold;
`

const Title = styled.span`
  font-weight: bold;
`

const Meta = styled.p`
  margin-top: 6px;
  font-size: 13px;
  color: #888;
`

const Message = styled.p`
  padding: 24px;
  text-align: center;
  color: ${(p) => (p.$error ? '#d32f2f' : '#888')};
`

export default Home
