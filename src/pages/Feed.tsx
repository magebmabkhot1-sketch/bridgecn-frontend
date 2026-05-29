import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { Globe, Search, Filter } from 'lucide-react'
import { motion } from 'framer-motion'
import ChatInterface from '../components/features/ChatInterface'

const Feed = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [activeChatUser, setActiveChatUser] = useState<any>(null)

  // Load User
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setCurrentUser(user)
      // Smart Filter: If I'm Chinese, show Internationals, and vice versa
      setFilter(user.studentType === 'chinese' ? 'international' : 'chinese')
    } else {
      navigate('/login')
    }
  }, [navigate])

  // Mock Data Fetching
  useEffect(() => {
    if (!currentUser) return
    
    // Simulate API delay
    setTimeout(() => {
      const mockUsers = [
        { id: '1', firstName: 'Li', lastName: 'Wei', university: 'Tsinghua', studentType: 'chinese', bio: 'Want to practice Business English.', interests: ['Business', 'Tech'] },
        { id: '2', firstName: 'Sarah', lastName: 'J.', university: 'Fudan', studentType: 'international', bio: 'Learning Mandarin for HSK 4.', interests: ['Culture', 'Food'] },
        { id: '3', firstName: 'Ahmed', lastName: 'H.', university: 'Zhejiang', studentType: 'international', bio: 'Engineering student looking for language partner.', interests: ['Sports', 'AI'] },
      ]
      
      let filtered = mockUsers
      if (filter === 'chinese') filtered = mockUsers.filter(u => u.studentType === 'chinese')
      if (filter === 'international') filtered = mockUsers.filter(u => u.studentType === 'international')
      
      setUsers(filtered)
      setLoading(false)
    }, 800)
  }, [currentUser, filter])

  const handleConnect = (user: any) => {
    toast.success(t('toast_connected'))
    setActiveChatUser(user)
  }

  if (activeChatUser) {
    return (
      <div className="fixed inset-0 z-50 bg-[#050816] flex items-center justify-center p-4">
        <div className="w-full max-w-4xl h-[90vh]">
          <ChatInterface currentUser={currentUser} targetUser={activeChatUser} onClose={() => setActiveChatUser(null)} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="pt-10 pb-6 px-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{t('feed_title')}</h1>
        <p className="text-gray-400">{t('feed_subtitle')}</p>
        
        {/* Filters */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {['all', 'chinese', 'international'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                filter === f ? 'bg-cyan-500 text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {t(`filter_${f === 'all' ? 'all' : f === 'chinese' ? 'cn' : 'intl'}`)}
            </button>
          ))}
        </div>
      </header>

      <main className="px-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse" />)}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 text-gray-500">{t('empty_state')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <motion.div 
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0a0f1c] border border-white/10 rounded-2xl p-6 hover:border-cyan-500/50 transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center font-bold text-lg">
                    {user.firstName[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{user.firstName} {user.lastName}</h3>
                    <p className="text-xs text-cyan-400 flex items-center gap-1"><Globe className="w-3 h-3"/> {user.university}</p>
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">"{user.bio}"</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {user.interests.map((tag: string, i: number) => (
                    <span key={i} className="px-2 py-1 rounded-md bg-white/5 text-xs text-gray-300">{tag}</span>
                  ))}
                </div>

                <button 
                  onClick={() => handleConnect(user)}
                  className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  {t('btn_connect')}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Feed