import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import api, { getErrorMessage } from '../api.js'
import { useAuth } from '../AuthContext.jsx'
import { formatDate } from '../constants.js'
import {
  FormBox,
  Label,
  Input,
  Select,
  Row,
  SubmitButton,
  Button,
  ErrorText,
  SuccessText,
} from '../components/Form.jsx'
import { colors, radius } from '../styles/theme.js'

function MyPage() {
  const { user, login, logout } = useAuth()
  const userId = user?.user_id
  const navigate = useNavigate()
  const [me, setMe] = useState(null)
  const [form, setForm] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId) return
    api
      .get('/users/me')
      .then((res) => {
        setMe(res.data)
        setForm({
          nickname: res.data.nickname,
          grade: String(res.data.grade),
          class_no: String(res.data.class_no),
          password: '',
          passwordCheck: '',
        })
      })
      .catch((err) => setError(getErrorMessage(err)))
  }, [userId])

  if (!user) return <Navigate to="/login" replace />
  if (!form) return error ? <ErrorText>{error}</ErrorText> : <p>불러오는 중...</p>

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (form.password !== form.passwordCheck) {
      setError('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.')
      return
    }

    setLoading(true)
    try {
      const res = await api.put('/users/me', {
        nickname: form.nickname,
        grade: Number(form.grade),
        class_no: Number(form.class_no),
        password: form.password || undefined,
      })
      login(res.data.token, res.data.user)
      setForm({ ...form, password: '', passwordCheck: '' })
      setSuccess(res.data.message)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async () => {
    if (!window.confirm('정말 탈퇴할까요? 작성한 글도 모두 삭제됩니다.')) return
    try {
      await api.delete('/users/me')
      logout()
      navigate('/')
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <FormBox onSubmit={handleSubmit}>
      <h2>마이페이지</h2>
      {error && <ErrorText>{error}</ErrorText>}
      {success && <SuccessText>{success}</SuccessText>}

      <Info>
        <span>아이디</span>
        <strong>{me.user_id}</strong>
        <span>가입일</span>
        <strong>{formatDate(me.created_at)}</strong>
      </Info>

      <Label>
        닉네임
        <Input name="nickname" value={form.nickname} onChange={handleChange} maxLength={30} required />
      </Label>
      <Row>
        <Label>
          학년
          <Select name="grade" value={form.grade} onChange={handleChange}>
            <option value="1">1학년</option>
            <option value="2">2학년</option>
            <option value="3">3학년</option>
          </Select>
        </Label>
        <Label>
          반
          <Input type="number" name="class_no" value={form.class_no} onChange={handleChange} min={1} max={20} required />
        </Label>
      </Row>
      <Label>
        새 비밀번호 (바꿀 때만 입력)
        <Input type="password" name="password" value={form.password} onChange={handleChange} minLength={4} />
      </Label>
      <Label>
        새 비밀번호 확인
        <Input type="password" name="passwordCheck" value={form.passwordCheck} onChange={handleChange} />
      </Label>

      <SubmitButton type="submit" disabled={loading}>
        {loading ? '저장 중...' : '저장'}
      </SubmitButton>
      <Button type="button" $variant="danger" onClick={handleWithdraw}>
        회원 탈퇴
      </Button>
    </FormBox>
  )
}

const Info = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px 16px;
  padding: 16px;
  border-radius: ${radius.control};
  background: ${colors.gray};
  font-size: 14px;

  span {
    color: ${colors.subText};
  }

  strong {
    font-weight: 600;
    word-break: break-all;
  }
`

export default MyPage
