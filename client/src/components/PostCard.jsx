import { Link } from 'react-router-dom'
import styled from 'styled-components'
import CategoryChip from './CategoryChip.jsx'
import { formatDate } from '../constants.js'
import { colors, radius, shadow, mobile } from '../styles/theme.js'

function PostCard({ post }) {
  return (
    <Card to={`/posts/${post.id}`}>
      <CategoryChip category={post.category} />
      <Title>{post.title}</Title>
      <Preview>{post.content}</Preview>
      <Meta>
        <strong>{post.nickname}</strong>
        <span>
          {post.grade}학년 {post.class_no}반
        </span>
        <span>{formatDate(post.created_at)}</span>
      </Meta>
    </Card>
  )
}

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 20px;
  background: ${colors.surface};
  border-radius: ${radius.card};
  box-shadow: ${shadow};
  transition: transform 0.15s, box-shadow 0.15s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }

  ${mobile} {
    padding: 16px;
  }
`

const Title = styled.h3`
  width: 100%;
  font-size: 17px;
  font-weight: 700;
  color: ${colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Preview = styled.p`
  width: 100%;
  font-size: 14px;
  color: ${colors.subText};
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px 10px;
  font-size: 13px;
  color: ${colors.subText};

  strong {
    color: ${colors.text};
    font-weight: 600;
  }
`

export default PostCard
