import styled from 'styled-components'
import { colors, radius, shadow, mobile } from '../styles/theme.js'

export const Card = styled.div`
  padding: 32px;
  background: ${colors.surface};
  border-radius: ${radius.card};
  box-shadow: ${shadow};

  ${mobile} {
    padding: 24px 20px;
  }
`

export const FormBox = styled.form`
  width: 100%;
  max-width: 400px;
  margin: 48px auto;
  padding: 36px 32px;
  background: ${colors.surface};
  border-radius: ${radius.card};
  box-shadow: ${shadow};
  display: flex;
  flex-direction: column;
  gap: 16px;

  h2 {
    font-size: 26px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  ${mobile} {
    margin: 16px auto;
    padding: 28px 20px;
  }
`

export const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${colors.subText};
`

const controlStyle = `
  width: 100%;
  height: 48px;
  padding: 0 14px;
  border: 1px solid ${colors.border};
  border-radius: ${radius.control};
  background: ${colors.surface};
  color: ${colors.text};
  font-size: 16px;
  font-weight: 400;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(49, 130, 246, 0.15);
  }
`

export const Input = styled.input`
  ${controlStyle}
`

export const Select = styled.select`
  ${controlStyle}
  font-family: inherit;
  cursor: pointer;
`

export const TextArea = styled.textarea`
  ${controlStyle}
  height: auto;
  min-height: 240px;
  padding: 14px;
  line-height: 1.6;
  resize: vertical;
`

export const Row = styled.div`
  display: flex;
  gap: 12px;
`

export const SubmitButton = styled.button`
  width: 100%;
  height: 52px;
  margin-top: 8px;
  border-radius: ${radius.control};
  background: ${colors.primary};
  color: ${colors.white};
  font-size: 16px;
  font-weight: 700;
  transition: background 0.15s;

  &:hover:not(:disabled) {
    background: ${colors.primaryHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 16px;
  border-radius: ${radius.control};
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  transition: background 0.15s;
  background: ${(p) => (p.$variant === 'primary' ? colors.primary : p.$variant === 'danger' ? colors.errorLight : colors.gray)};
  color: ${(p) => (p.$variant === 'primary' ? colors.white : p.$variant === 'danger' ? colors.error : colors.text)};

  &:hover {
    background: ${(p) => (p.$variant === 'primary' ? colors.primaryHover : p.$variant === 'danger' ? colors.errorHover : colors.grayHover)};
  }
`

export const ErrorText = styled.p`
  padding: 12px 14px;
  border-radius: ${radius.control};
  background: ${colors.errorLight};
  color: ${colors.error};
  font-size: 14px;
  font-weight: 500;
`

export const SuccessText = styled.p`
  padding: 12px 14px;
  border-radius: ${radius.control};
  background: ${colors.primaryLight};
  color: ${colors.primaryHover};
  font-size: 14px;
  font-weight: 500;
`

export const Bottom = styled.p`
  text-align: center;
  font-size: 14px;
  color: ${colors.subText};

  a {
    margin-left: 4px;
    color: ${colors.primary};
    font-weight: 600;
  }
`
