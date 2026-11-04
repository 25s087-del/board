import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import SignupPage from './pages/SignupPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import PostDetailPage from './pages/PostDetailPage.jsx'
import PostCreatePage from './pages/PostCreatePage.jsx'
import PostEditPage from './pages/PostEditPage.jsx'

function App() {
  return (
    <Routes>
      {/* Layout 안에 들어가는 페이지들은 공통 헤더를 함께 보여줌 */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* 게시글: /posts/new 를 /posts/:id 보다 위에 둬야 헷갈리지 않음 */}
        <Route path="/posts/new" element={<PostCreatePage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route path="/posts/:id/edit" element={<PostEditPage />} />
        <Route path="*" element={<p>없는 페이지입니다.</p>} />
      </Route>
    </Routes>
  )
}

export default App
