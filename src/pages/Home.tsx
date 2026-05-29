import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Globe, GraduationCap, Users, ArrowRight } from 'lucide-react'
import axios from 'axios'

const Home = () => {
  const { t, i18n } = useTranslation()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    try {
      // Note: Ensure your backend has a /api/waitlist endpoint or adjust this URL
      await axios.post('https://bridgecn-api.onrender.com/api/auth/register', {
        firstName: 'Waitlist',
        lastName: 'User',
        email: email,
        password: 'temp12345678', // Temporary password for waitlist logic if needed
        university: 'Pending',
        studentType: 'international',
        yearOfStudy: 'Freshman',
        interests: []
      })
      toast.success('🎉 You have been added to the waitlist!')
      setEmail('')
    } catch (err) {
      toast.error('❌ Failed to join. Email might already exist.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-hidden">
      
      {/* Navbar Placeholder for Consistency */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-[#050816]/80 backdrop-blur-md border-b border-white/10">
        <div className="text-xl font-bold tracking-tight">BridgeCN</div>
        <button 
          onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'zh' : 'en')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-sm text-gray-300 transition-all"
        >
          <Globe className="w-4 h-4" />
          {i18n.language === 'en' ? '中文' : 'English'}
        </button>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-medium mb-6 border border-cyan-500/20">
            Exclusive Student Network
          </span>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Connect Beyond <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Language.
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            A verified university network connecting Chinese and international students across China for mutual language learning and cultural exchange.
          </p>

          {/* Waitlist Form */}
          <form onSubmit={handleJoinWaitlist} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 mb-12">
            <input 
              type="email" 
              placeholder="Enter your university email..." 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500 transition-all"
              required
            />
            <button 
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-bold text-white hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-cyan-500/20 whitespace-nowrap"
            >
              {loading ? 'Joining...' : 'Join Waitlist'}
            </button>
          </form>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-left">
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/[0.07] transition-all">
              <GraduationCap className="w-10 h-10 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Verified Universities</h3>
              <p className="text-gray-400 text-sm">Join exclusive communities from Zhejiang, Tsinghua, Fudan, and more.</p>
            </div>
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/[0.07] transition-all">
              <Users className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Smart Matching</h3>
              <p className="text-gray-400 text-sm">Our algorithm pairs you with partners who complement your language goals.</p>
            </div>
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/[0.07] transition-all">
              <Globe className="w-10 h-10 text-green-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Global Connection</h3>
              <p className="text-gray-400 text-sm">Break down barriers with integrated translation and cultural tips.</p>
            </div>
          </div>

          {/* Auth Links */}
          <div className="mt-16 flex gap-6 justify-center">
            <Link to="/login" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
              Already a member? <ArrowRight className="w-4 h-4" /> Login
            </Link>
            <Link to="/register" className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2">
              Create Account <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default Home
