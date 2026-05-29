import { useState, useRef, useEffect } from 'react'
import { 
  Send, Phone, Video, Paperclip, Image as ImageIcon, 
  MoreVertical, Mic, MicOff, VideoOff, PhoneOff, 
  Smile, ArrowLeft, Check, CheckCheck
} from 'lucide-react'
import { motion } from 'framer-motion'
import { io } from 'socket.io-client'
import toast from 'react-hot-toast'

// --- Types ---
interface Message {
  id: string
  senderId: string
  text?: string
  mediaUrl?: string
  mediaType?: 'image' | 'video'
  timestamp: Date
  status: 'sent' | 'delivered' | 'read'
}

interface User {
  id: string
  name: string
  avatar: string
  status: 'online' | 'offline' | 'in-call'
  university: string
}

interface ChatInterfaceProps {
  currentUser: any
  targetUser: User
  onClose: () => void
}

const ChatInterface = ({ currentUser, targetUser, onClose }: ChatInterfaceProps) => {
  // State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: targetUser.id,
      text: `Hi ${currentUser.firstName}! I saw you're interested in language exchange.`,
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      status: 'read'
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [callState, setCallState] = useState<'idle' | 'ringing' | 'connected'>('idle')
  const [callType, setCallType] = useState<'audio' | 'video'>('audio')
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const socket = useRef<any>(null)

  // Initialize Socket Connection
  useEffect(() => {
    socket.current = io('https://bridgecn-api.onrender.com')

    if (currentUser?.id) {
      socket.current.emit('join-user-room', currentUser.id)
    }

    socket.current.on('receive-message', (newMessage: Message) => {
      setMessages(prev => [...prev, newMessage])
      toast.success('New message received!')
    })

    return () => {
      socket.current.disconnect()
    }
  }, [currentUser])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Send Message via Socket
  const handleSend = () => {
    if (!inputText.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      text: inputText,
      timestamp: new Date(),
      status: 'sent'
    }

    setMessages(prev => [...prev, newMessage])
    
    if (socket.current) {
      socket.current.emit('send-private-message', {
        targetUserId: targetUser.id,
        messageData: newMessage
      })
    }

    setInputText('')
  }

  // Handle Media Upload (Mock)
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    const type = file.type.startsWith('image/') ? 'image' : 'video'

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      mediaUrl: url,
      mediaType: type,
      timestamp: new Date(),
      status: 'sent'
    }

    setMessages(prev => [...prev, newMessage])
    setShowMediaPicker(false)
  }

  // Start Call (Mock)
  const startCall = (type: 'audio' | 'video') => {
    setCallType(type)
    setCallState('ringing')
    setTimeout(() => setCallState('connected'), 2000)
  }

  const endCall = () => {
    setCallState('idle')
  }

  // --- Render Helpers ---

  if (callState !== 'idle') {
    return (
      <div className="fixed inset-0 z-50 bg-[#050816] flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-purple-900/20 backdrop-blur-3xl"></div>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 flex flex-col items-center gap-6"
        >
          <div className={`w-32 h-32 rounded-full border-4 ${callState === 'connected' ? 'border-green-500' : 'border-cyan-500'} p-1 relative`}>
            <img 
              src={targetUser.avatar || `https://ui-avatars.com/api/?name=${targetUser.name}&background=random`} 
              alt={targetUser.name} 
              className="w-full h-full rounded-full object-cover"
            />
            {callState === 'ringing' && (
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500/50 animate-ping"></div>
            )}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">{targetUser.name}</h2>
            <p className="text-cyan-400 mt-1">
              {callState === 'ringing' ? `Calling ${callType === 'video' ? 'Video' : 'Audio'}...` : '00:42 • Connected'}
            </p>
          </div>
          <div className="flex gap-6 mt-8">
            <button className="p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all">
              {callType === 'audio' ? <Mic className="w-6 h-6" /> : <Video className="w-6 h-6" />}
            </button>
            <button 
              onClick={endCall}
              className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 transition-all transform hover:scale-110"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
            <button className="p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all">
              <MicOff className="w-6 h-6" />
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[85vh] bg-[#0a0f1c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-[#050816]/80 backdrop-blur-md border-b border-white/5 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="relative">
            <img 
              src={targetUser.avatar || `https://ui-avatars.com/api/?name=${targetUser.name}&background=random`} 
              alt={targetUser.name} 
              className="w-10 h-10 rounded-full object-cover border-2 border-cyan-500/50"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#050816]"></div>
          </div>
          <div>
            <h3 className="font-bold text-white">{targetUser.name}</h3>
            <p className="text-xs text-gray-400">{targetUser.university}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => startCall('audio')} className="p-2.5 rounded-full bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-400 text-gray-400 transition-all">
            <Phone className="w-5 h-5" />
          </button>
          <button onClick={() => startCall('video')} className="p-2.5 rounded-full bg-white/5 hover:bg-purple-500/20 hover:text-purple-400 text-gray-400 transition-all">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 transition-all">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#050816]">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id
          return (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                {msg.mediaUrl && (
                  <div className="mb-2 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                    {msg.mediaType === 'image' ? (
                      <img src={msg.mediaUrl} alt="Shared" className="max-w-full h-auto" />
                    ) : (
                      <video src={msg.mediaUrl} controls className="max-w-full h-auto" />
                    )}
                  </div>
                )}
                {msg.text && (
                  <div className={`px-5 py-3 rounded-2xl shadow-sm ${
                    isMe 
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none' 
                      : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/5'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                )}
                <div className="flex items-center gap-1 mt-1 px-1">
                  <span className="text-[10px] text-gray-500">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isMe && (
                    msg.status === 'read' ? <CheckCheck className="w-3 h-3 text-cyan-400" /> : <Check className="w-3 h-3 text-gray-500" />
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#050816] border-t border-white/5">
        <div className="flex items-end gap-3 bg-white/5 p-2 rounded-3xl border border-white/10 focus-within:border-cyan-500/50 transition-colors">
          <button onClick={() => setShowMediaPicker(!showMediaPicker)} className="p-3 rounded-full text-gray-400 hover:text-cyan-400 hover:bg-white/5 transition-all">
            <Paperclip className="w-5 h-5" />
          </button>
          {showMediaPicker && (
             <input type="file" accept="image/*,video/*" className="hidden" ref={fileInputRef} onChange={handleMediaUpload} />
          )}
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-white placeholder-gray-500 resize-none max-h-32 py-3 focus:outline-none text-sm"
            rows={1}
          />
          <button className="p-3 rounded-full text-gray-400 hover:text-yellow-400 hover:bg-white/5 transition-all">
            <Smile className="w-5 h-5" />
          </button>
          <button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="p-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface
