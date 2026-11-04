import { Link, Outlet } from 'react-router-dom'
import styled from 'styled-components'

// 모든 페이지에 공통으로 보이는 틀(헤더 + 본문 영역)
function Layout() {
  return (
    <>
      <Header>
        <Logo to="/">학급 게시판</Logo>
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
  height: 60px;
  padding: 0 24px;
  border-bottom: 1px solid #ddd;
  background: #fff;
`

const Logo = styled(Link)`
  font-size: 20px;
  font-weight: bold;
`

const Main = styled.main`
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
`

export default Layout
