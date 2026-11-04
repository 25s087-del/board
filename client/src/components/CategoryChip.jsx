import styled from 'styled-components'
import { categoryColors, colors, radius } from '../styles/theme.js'

function CategoryChip({ category }) {
  const color = categoryColors[category] || { bg: colors.gray, text: colors.subText }
  return (
    <Chip $bg={color.bg} $text={color.text}>
      {category}
    </Chip>
  )
}

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: ${radius.chip};
  background: ${(p) => p.$bg};
  color: ${(p) => p.$text};
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
`

export default CategoryChip
