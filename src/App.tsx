import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Home from './pages/Home' // Assuming you have a Home/Landing page
import Login from './pages/Login'
import Register from './pages/Register'
import Feed from './pages/Feed'

function AppContent() {
  const location = useLocation()
  // Show Navbar on all pages except Login/Register if you prefer
  const showNavbar = !['/login', '/register'].includes(location.pathname)

  return (
    <div className="min-h-screen bg-[#050816] text-white font-sans">
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </div>
  )
}

function App() {
  return <AppContent />
}

export default App