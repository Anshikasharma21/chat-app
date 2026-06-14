import React, { useEffect, useRef, useContext, useState } from 'react'
import toast from 'react-hot-toast'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'

const ChatContainer = () => {
  const {
    messages,
    selectedUser,
    setSelectedUser,
    sendMessage,
    getMessages,
  } = useContext(ChatContext)

  const { authUser, onlineUsers } = useContext(AuthContext)

  const [input, setInput] = useState('')
  const scrollEnd = useRef(null)

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault()
    if (!input.trim()) return
    await sendMessage({ text: input.trim() })
    setInput('')
  }

  const handleSendImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Select an image file')
      return
    }
    const reader = new FileReader()
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result })
      e.target.value = ''
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (selectedUser?._id) getMessages(selectedUser._id)
  }, [selectedUser, getMessages])

  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
        <img src={assets.logo_icon} className="max-w-16 animate-pulse" alt="" />
        <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
      </div>
    )
  }

  return (
    <div className="h-full overflow-hidden relative backdrop-blur-lg">

      {/* HEADER */}
      <div className="flex items-center gap-3 py-3 px-4 border-b border-stone-500 animate-slide-down">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          className="w-8 h-8 rounded-full object-cover ring-2 ring-violet-400/30"
          alt=""
        />

        <div className="flex-1">
          <p className="text-white flex items-center gap-2">
            {selectedUser.fullName}
            {Array.isArray(onlineUsers) && onlineUsers.includes(selectedUser._id) && (
              <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_6px_2px_rgba(34,197,94,0.5)]"></span>
            )}
          </p>
        </div>

        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          className="md:hidden w-6 cursor-pointer hover:opacity-70 transition-opacity"
          alt=""
        />

        <img src={assets.help_icon} className="hidden md:block w-5 opacity-70 hover:opacity-100 transition-opacity" alt="" />
      </div>

      {/* MESSAGES */}
      <div className="h-[calc(100%-120px)] overflow-y-auto p-4 flex flex-col gap-1">
        {messages?.map((msg, index) => {
          const sender = msg.senderID || msg.senderId || msg.sender
          const isMyMessage = sender === authUser?._id

          return (
            <div
              key={msg._id || index}
              className={`flex mb-4 animate-fade-in ${isMyMessage ? 'justify-end' : 'justify-start'}`}
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              <div className="flex items-end gap-2">

                {!isMyMessage && (
                  <img
                    src={selectedUser?.profilePic || assets.avatar_icon}
                    className="w-7 h-7 rounded-full"
                    alt=""
                  />
                )}

                <div>
                  {msg.image ? (
                    <img
                      src={msg.image}
                      className="max-w-[220px] rounded-lg border border-gray-700 hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
                      alt=""
                    />
                  ) : (
                    <div
                      className={`px-3 py-2 rounded-lg text-white max-w-[240px] break-words transition-all duration-200 ${
                        isMyMessage
                          ? 'bg-violet-500/30 hover:bg-violet-500/40'
                          : 'bg-[#282142] hover:bg-[#2e2650]'
                      }`}
                    >
                      {msg.text}
                    </div>
                  )}

                  <p className="text-[10px] text-gray-400 mt-1">
                    {formatMessageTime(msg.createdAt)}
                  </p>
                </div>

                {isMyMessage && (
                  <img
                    src={authUser?.profilePic || assets.avatar_icon}
                    className="w-7 h-7 rounded-full"
                    alt=""
                  />
                )}
              </div>
            </div>
          )
        })}

        <div ref={scrollEnd}></div>
      </div>

      {/* INPUT */}
      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center gap-3 animate-slide-up">

        <div className="flex-1 flex items-center bg-gray-100/10 rounded-full px-3 border border-transparent focus-within:border-violet-400/40 transition-all duration-200">

          <input
            type="text"
            placeholder="Send a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)}
            className="flex-1 bg-transparent outline-none text-white p-3"
          />

          <input
            type="file"
            id="image"
            hidden
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleSendImage}
          />

          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              className="w-5 cursor-pointer opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-200"
              alt=""
            />
          </label>
        </div>

        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          className="w-8 cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-150"
          alt=""
        />
      </div>
    </div>
  )
}

export default ChatContainer