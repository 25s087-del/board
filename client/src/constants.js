// 게시글 카테고리 (서버 DB의 ENUM 값과 똑같아야 함)
export const CATEGORIES = ['공지', '수행평가', '자유', '분실물']

// 'YYYY-MM-DD HH:mm:ss' → 'YYYY-MM-DD HH:mm' (초는 빼고 보여주기)
export function formatDate(dateString) {
  return dateString ? dateString.slice(0, 16) : ''
}
