import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, GraduationCap, Globe, BookOpen } from 'lucide-react'
import axios from 'axios'

const Register = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    studentType: 'international' as 'chinese' | 'international',
    yearOfStudy: '',
    interests: [] as string[]
  })

  // Options
  const universities = [
    'Zhejiang University',
    'Tsinghua University', 
    'Fudan University',
    'Peking University',
    'Shanghai Jiao Tong University',
    'Other'
  ]

  const years = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate']
  
  const interestOptions = [
    'Technology', 'Business', 'Arts', 'Sports', 'Music', 
    'Languages', 'Research', 'Entrepreneurship', 'Culture Exchange'
  ]

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle Radio Button Changes
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, studentType: e.target.value as any }))
  }

  // Toggle Interests
  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 1. Client-side Validation
    if (!formData.firstName || formData.firstName.length < 2) {
      alert("First Name must be at least 2 characters.")
      return
    }
    if (!formData.lastName || formData.lastName.length < 2) {
      alert("Last Name must be at least 2 characters.")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.")
      return
    }
    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters.")
      return
    }
    if (!formData.university) {
      alert("Please select a University.")
      return
    }
    if (!formData.yearOfStudy) {
      alert("Please select a Year of Study.")
      return
    }

    try {
      setLoading(true)
      
      // 2. Prepare Payload (Must match Backend Zod Schema exactly)
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        university: formData.university,
        studentType: formData.studentType, // MUST be 'chinese' or 'international' (lowercase)
        yearOfStudy: formData.yearOfStudy,
        interests: formData.interests
      }

      console.log(" Sending Payload:", payload)

      // 3. API Call
      const response = await axios.post('https://bridgecn-api.onrender.com/api/auth/register', payload)

      console.log("✅ Success:", response.data)

      // 4. Save Auth Data
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      // 5. Redirect to Feed
      navigate('/feed') 
      
    } catch (err: any) {
      console.error(" Registration Error:", err)
      
      // DEBUGGING ALERTS - This will tell you exactly what is wrong
      let errorMessage = "Registration failed.";

      if (err.response?.data?.errors) {
        // Backend sent Zod validation errors
        const details = err.response.data.errors.map((e: any) => {
          return `${e.field}: ${e.message}`;
        }).join('\n');
        errorMessage = "Validation Failed:\n" + details;
      } else if (err.response?.data?.message) {
        // Backend sent a general error message
        errorMessage = err.response.data.message;
      } else if (err.message) {
        // Network or Axios error
        errorMessage = err.message;
      }

      setError(errorMessage);
      alert(errorMessage); // Show pop-up so you can't miss it
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
            Join BridgeCN
          </h1>
          <p className="text-gray-400">Create your global student identity</p>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm whitespace-pre-wrap">
            <strong>Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">First Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 text-white placeholder-gray-500 transition-colors"
                  placeholder="John"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Last Name *</label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 text-white placeholder-gray-500 transition-colors"
                placeholder="Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 text-white placeholder-gray-500 transition-colors"
                placeholder="student@university.edu"
              />
            </div>
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password * (min 8)</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 text-white placeholder-gray-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 text-white placeholder-gray-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* University */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">University *</label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                name="university"
                required
                value={formData.university}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 text-white appearance-none cursor-pointer"
              >
                <option value="" className="bg-[#0a0f1c]">Select your university</option>
                {universities.map((uni) => (
                  <option key={uni} value={uni} className="bg-[#0a0f1c]">{uni}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Student Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Student Type *</label>
            <div className="flex gap-4">
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="studentType"
                  value="international"
                  checked={formData.studentType === 'international'}
                  onChange={handleRadioChange}
                  className="sr-only peer"
                />
                <div className="p-4 bg-black/30 border border-white/10 rounded-xl text-center peer-checked:border-cyan-400 peer-checked:bg-cyan-400/10 transition-all hover:border-white/20">
                  <Globe className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
                  <span className="text-sm text-gray-300">International</span>
                </div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="studentType"
                  value="chinese"
                  checked={formData.studentType === 'chinese'}
                  onChange={handleRadioChange}
                  className="sr-only peer"
                />
                <div className="p-4 bg-black/30 border border-white/10 rounded-xl text-center peer-checked:border-purple-400 peer-checked:bg-purple-400/10 transition-all hover:border-white/20">
                  <Globe className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                  <span className="text-sm text-gray-300">Chinese</span>
                </div>
              </label>
            </div>
          </div>

          {/* Year of Study */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Year of Study *</label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                name="yearOfStudy"
                required
                value={formData.yearOfStudy}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 text-white appearance-none cursor-pointer"
              >
                <option value="" className="bg-[#0a0f1c]">Select year</option>
                {years.map((year) => (
                  <option key={year} value={year} className="bg-[#0a0f1c]">{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Interests (Optional)</label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    formData.interests.includes(interest)
                      ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white'
                      : 'bg-black/30 border border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl font-semibold text-white hover:opacity-90 disabled:opacity-50 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Login Link */}
          <p className="text-center text-gray-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
              Login
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  )
}

export default Register
