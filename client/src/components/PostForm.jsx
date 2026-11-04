import { useState } from 'react'
import styled from 'styled-components'
import { CATEGORIES } from '../constants.js'
import { getErrorMessage } from '../api.js'
import { Label, Input, Select, SubmitButton, ErrorText } from './Form.jsx'

// 글 작성·수정 화면에서 같이 쓰는 입력 폼
// initial: 처음 채워둘 값 (수정할 때는 기존 글 내용)
// onSubmit: 등록/수정 버튼을 눌렀을 때 실행할 함수 (부모 페이지가 넘겨줌)
function PostForm({ title, initial, submitText, onSubmit }) {
  const [form, setForm] = useState(
    initial || { category: '자유', title: '', content: '' },
  )
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onSubmit(form)
    } catch (err) {
      setError(getErrorMessage(err)) // 서버가 보낸 에러 메시지를 화면에 표시
      setLoading(false)
    }
  }

  return (
    <Box onSubmit={handleSubmit}>
      <h2>{title}</h2>
      {error && <ErrorText>{error}</ErrorText>}

      <Label>
        카테고리
        <Select name="category" value={form.category} onChange={handleChange}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
      </Label>
      <Label>
        제목
        <Input name="title" value={form.title} onChange={handleChange} maxLength={200} required />
      </Label>
      <Label>
        내용
        <TextArea name="content" value={form.content} onChange={handleChange} rows={12} required />
      </Label>

      <SubmitButton type="submit" disabled={loading}>
        {loading ? '저장 중...' : submitText}
      </SubmitButton>
    </Box>
  )
}

const Box = styled.form`
  padding: 32px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-weight: normal;
  resize: vertical;
`

export default PostForm
