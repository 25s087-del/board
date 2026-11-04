import { Link, Outlet, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../AuthContext.jsx'

// 모든 페이지에 공통으로 보이는 틀(헤더 + 본문 영역)
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
        <Logo to="/">학급 게시판</Logo>
        <Menu>
          {user ? (
            // 로그인 상태: "닉네임(학년-반)" + 로그아웃 버튼
            <>
              <UserName>
                {user.nickname}({user.grade}-{user.class_no})
              </UserName>
              <MenuButton onClick={handleLogout}>로그아웃</MenuButton>
            </>
          ) : (
            // 로그아웃 상태: 로그인, 회원가입 링크
            <>
              <MenuLink to="/login">로그인</MenuLink>
              <MenuLink to="/signup">회원가입</MenuLink>
            </>
          )}
        </Menu>
      </Header>
      <Main>
        {/* Outlet 자리에 현재 주소에 맞는 페이지가 들어감 */}
        <Outlet />
      </Main>
    </>
  )
}

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between; /* 로고는 왼쪽, 메뉴는 오른쪽 */
  height: 60px;
  padding: 0 24px;
  border-bottom: 1px solid #ddd;
  background: #fff;
`

const Logo = styled(Link)`
  font-size: 20px;
  font-weight: bold;
`

const Menu = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
`

const UserName = styled.span`
  font-weight: bold;
  margin-right: 4px;
`

const MenuLink = styled(Link)`
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
`

const MenuButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
`

const Main = styled.main`
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
`

export default Layout
