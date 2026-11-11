export const CATEGORIES = ['공지', '수행평가', '자유', '분실물']

export function authorName(post) {
  if (post.is_anonymous) return post.is_mine ? '익명(나)' : '익명'
  return post.nickname
}

export function authorClass(post) {
  if (post.is_anonymous) return ''
  return `${post.grade}학년 ${post.class_no}반`
}

export function formatDate(dateString) {
  return dateString ? dateString.slice(0, 16) : ''
}
