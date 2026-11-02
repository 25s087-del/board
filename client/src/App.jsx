import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'

function App() {
  return (
    <Routes>
      {/* Layout 안에 들어가는 페이지들은 공통 헤더를 함께 보여줌 */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  )
}

export default App
