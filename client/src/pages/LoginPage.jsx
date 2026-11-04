import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { getErrorMessage } from '../api.js'
import { useAuth } from '../AuthContext.jsx'
import { FormBox, Label, Input, SubmitButton, ErrorText, Bottom } from '../components/Form.jsx'

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/users/login', { email, password })
      // 서버가 준 token 과 user 정보를 localStorage 에 저장 (AuthContext 의 login)
      login(res.data.token, res.data.user)
      navigate('/') // 메인으로 이동
    } catch (err) {
      setError(getErrorMessage(err)) // 예: 401 → "이메일 또는 비밀번호가 올바르지 않습니다."
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormBox onSubmit={handleSubmit}>
      <h2>로그인</h2>
      {error && <ErrorText>{error}</ErrorText>}

      <Label>
        이메일
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </Label>
      <Label>
        비밀번호
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </Label>

      <SubmitButton type="submit" disabled={loading}>
        {loading ? '로그인 중...' : '로그인'}
      </SubmitButton>
      <Bottom>
        계정이 없나요? <Link to="/signup">회원가입</Link>
      </Bottom>
    </FormBox>
  )
}

export default LoginPage
