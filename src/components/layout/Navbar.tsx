import { useTranslation } from 'react-i18next'
import { Globe, User, LogOut, MessageSquare } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

const Navbar = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  // Handle Language Switch
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en'
    i18n.changeLanguage(newLang)
  }

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  // Hide Navbar on Login/Register pages for cleaner look
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null
  }

  return (
    <nav className="sticky top-0 z-40 w-full bg-[#050816]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => navigate('/feed')}
          >
            <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white">
              B
            </div>
            <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
              BridgeCN
            </span>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            
            {/* Language Toggle */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-sm text-gray-300 transition-all border border-white/5"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{t('lang_switch')}</span>
            </button>

            {/* Profile / Logout */}
            <button 
              onClick={handleLogout}
              className="p-2 rounded-full text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
              title={t('nav_logout')}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
