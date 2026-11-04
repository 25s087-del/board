import styled from 'styled-components'

// 회원가입·로그인 화면에서 같이 쓰는 폼 스타일 모음

export const FormBox = styled.form`
  max-width: 400px;
  margin: 40px auto;
  padding: 32px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  h2 {
    text-align: center;
    margin-bottom: 8px;
  }
`

export const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  font-weight: bold;
  flex: 1;
`

export const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-weight: normal;
`

export const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font: inherit;
`

export const Row = styled.div`
  display: flex;
  gap: 12px;
`

export const SubmitButton = styled.button`
  margin-top: 8px;
  padding: 12px;
  border-radius: 4px;
  background: #2f6fed;
  color: #fff;
  font-weight: bold;

  &:disabled {
    background: #9bb5ee;
    cursor: default;
  }
`

// 에러 메시지 (빨간 박스)
export const ErrorText = styled.p`
  padding: 10px;
  border-radius: 4px;
  background: #fdecec;
  color: #d32f2f;
  font-size: 14px;
`

export const Bottom = styled.p`
  text-align: center;
  font-size: 14px;
  color: #666;

  a {
    color: #2f6fed;
    font-weight: bold;
  }
`
