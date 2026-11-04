import { Link, Outlet, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../AuthContext.jsx'
import { colors, radius, mobile } from '../styles/theme.js'

function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <Header>
        <Inner>
          <Logo to="/">학급 게시판</Logo>
          <Menu>
            {user ? (
              <>
                <TextButton as={Link} to="/class">
                  우리 반
                </TextButton>
                <UserBadge to="/mypage">
                  {user.nickname}({user.grade}-{user.class_no})
                </UserBadge>
                <TextButton onClick={handleLogout}>로그아웃</TextButton>
              </>
            ) : (
              <>
                <TextButton as={Link} to="/login">
                  로그인
                </TextButton>
                <FilledButton to="/signup">회원가입</FilledButton>
              </>
            )}
          </Menu>
        </Inner>
      </Header>
      <Main>
        <Outlet />
      </Main>
    </>
  )
}

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  background: ${colors.surface};
  border-bottom: 1px solid ${colors.border};
`

const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  max-width: 960px;
  height: 60px;
  margin: 0 auto;
  padding: 0 24px;

  ${mobile} {
    height: 56px;
    padding: 0 16px;
  }
`

const Logo = styled(Link)`
  font-size: 20px;
  font-weight: 800;
  color: ${colors.primary};
  white-space: nowrap;

  ${mobile} {
    font-size: 18px;
  }
`

const Menu = styled.nav`
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
`

const UserBadge = styled(Link)`
  max-width: 160px;
  height: 32px;
  line-height: 32px;
  padding: 0 12px;
  margin: 0 4px;
  border-radius: ${radius.chip};
  background: ${colors.gray};
  color: ${colors.text};
  font-size: 13px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: background 0.15s;

  &:hover {
    background: ${colors.grayHover};
  }

  ${mobile} {
    max-width: 96px;
    padding: 0 10px;
    margin: 0 2px;
  }
`

const TextButton = styled.button`
  height: 36px;
  padding: 0 12px;
  border-radius: ${radius.control};
  color: ${colors.subText};
  font-size: 14px;
  font-weight: 600;
  line-height: 36px;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: ${colors.gray};
    color: ${colors.text};
  }

  ${mobile} {
    padding: 0 8px;
    font-size: 13px;
  }
`

const FilledButton = styled(Link)`
  height: 36px;
  padding: 0 14px;
  border-radius: ${radius.control};
  background: ${colors.primary};
  color: ${colors.white};
  font-size: 14px;
  font-weight: 600;
  line-height: 36px;
  white-space: nowrap;
  transition: background 0.15s;

  &:hover {
    background: ${colors.primaryHover};
  }
`

const Main = styled.main`
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;

  ${mobile} {
    padding: 16px;
  }
`

export default Layout
