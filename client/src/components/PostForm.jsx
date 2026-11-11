import { useState } from 'react'
import styled from 'styled-components'
import { CATEGORIES } from '../constants.js'
import { getErrorMessage } from '../api.js'
import { Label, Input, Select, TextArea, SubmitButton, ErrorText } from './Form.jsx'
import Toggle from './Toggle.jsx'
import { colors, radius, shadow, mobile } from '../styles/theme.js'

function PostForm({ title, initial, submitText, onSubmit }) {
  const [form, setForm] = useState(
    initial || { category: '자유', title: '', content: '', is_anonymous: false },
  )
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onSubmit(form)
    } catch (err) {
      setError(getErrorMessage(err))
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
      <Toggle
        label="익명으로 올리기"
        description="다른 사람에게 닉네임과 학년·반이 보이지 않아요"
        name="is_anonymous"
        checked={form.is_anonymous}
        onChange={handleChange}
      />

      <SubmitButton type="submit" disabled={loading}>
        {loading ? '저장 중...' : submitText}
      </SubmitButton>
    </Box>
  )
}

const Box = styled.form`
  max-width: 720px;
  margin: 0 auto;
  padding: 32px;
  background: ${colors.surface};
  border-radius: ${radius.card};
  box-shadow: ${shadow};
  display: flex;
  flex-direction: column;
  gap: 16px;

  h2 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  ${mobile} {
    padding: 24px 20px;
  }
`

export default PostForm
