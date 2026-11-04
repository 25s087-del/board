export const CATEGORIES = ['공지', '수행평가', '자유', '분실물']

export function formatDate(dateString) {
  return dateString ? dateString.slice(0, 16) : ''
}
