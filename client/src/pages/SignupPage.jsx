import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { getErrorMessage } from '../api.js'
import { FormBox, Label, Input, Select, Row, SubmitButton, ErrorText, Bottom } from '../components/Form.jsx'

function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    user_id: '',
    password: '',
    passwordCheck: '',
    nickname: '',
    grade: '1',
    class_no: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.passwordCheck) {
      setError('비밀번호와 비밀번호 확인이 일치하지 않습니다.')
      return
    }

    setLoading(true)
    try {
      await api.post('/users/signup', {
        user_id: form.user_id,
        password: form.password,
        nickname: form.nickname,
        grade: Number(form.grade),
        class_no: Number(form.class_no),
      })
      alert('회원가입이 완료되었습니다. 로그인해 주세요.')
      navigate('/login')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormBox onSubmit={handleSubmit}>
      <h2>회원가입</h2>
      {error && <ErrorText>{error}</ErrorText>}

      <Label>
        아이디 (영문·숫자 4~20자)
        <Input
          name="user_id"
          value={form.user_id}
          onChange={handleChange}
          pattern="[A-Za-z0-9]{4,20}"
          title="영문·숫자 4~20자"
          maxLength={20}
          autoComplete="username"
          required
        />
      </Label>
      <Label>
        비밀번호 (4자 이상)
        <Input type="password" name="password" value={form.password} onChange={handleChange} minLength={4} required />
      </Label>
      <Label>
        비밀번호 확인
        <Input type="password" name="passwordCheck" value={form.passwordCheck} onChange={handleChange} required />
      </Label>
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

      <SubmitButton type="submit" disabled={loading}>
        {loading ? '가입 중...' : '회원가입'}
      </SubmitButton>
      <Bottom>
        이미 계정이 있나요? <Link to="/login">로그인</Link>
      </Bottom>
    </FormBox>
  )
}

export default SignupPage
