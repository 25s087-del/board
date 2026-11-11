import styled from 'styled-components'
import { colors, radius } from '../styles/theme.js'

function Toggle({ label, description, ...inputProps }) {
  return (
    <ToggleRow>
      <ToggleText>
        <strong>{label}</strong>
        {description && <span>{description}</span>}
      </ToggleText>
      <ToggleInput type="checkbox" role="switch" {...inputProps} />
    </ToggleRow>
  )
}

const ToggleRow = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  border-radius: ${radius.control};
  background: ${colors.gray};
  cursor: pointer;
`

const ToggleText = styled.span`
  display: flex;
  flex-direction: column;
  gap: 2px;

  strong {
    font-size: 15px;
    font-weight: 600;
    color: ${colors.text};
  }

  span {
    font-size: 13px;
    color: ${colors.subText};
  }
`

const ToggleInput = styled.input`
  appearance: none;
  flex-shrink: 0;
  position: relative;
  width: 48px;
  height: 28px;
  border-radius: ${radius.chip};
  background: ${colors.border};
  cursor: pointer;
  transition: background 0.2s;

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: ${colors.white};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s;
  }

  &:checked {
    background: ${colors.primary};
  }

  &:checked::after {
    transform: translateX(20px);
  }

  &:focus-visible {
    outline: 3px solid rgba(49, 130, 246, 0.3);
    outline-offset: 2px;
  }
`

export default Toggle
