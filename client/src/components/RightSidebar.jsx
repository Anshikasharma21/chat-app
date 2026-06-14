import React, { useContext } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext)
  const { logout, onlineUsers } = useContext(AuthContext)

  const msgImages = messages.filter((msg) => msg.image).map((msg) => msg.image)

  if (!selectedUser) return null

  const isOnline = onlineUsers.includes(selectedUser._id)

  return (
    <div className="bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll max-md:hidden animate-slide-up">

      <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">

        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt="profile"
          className="w-20 aspect-square rounded-full transition-transform duration-300 hover:scale-110 ring-2 ring-violet-400/30"
        />

        <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full transition-colors duration-500 ${isOnline ? 'bg-green-500 shadow-[0_0_6px_2px_rgba(34,197,94,0.5)]' : 'bg-gray-400'}`}></span>
          {selectedUser.fullName}
        </h1>

        <p className="px-10 mx-auto text-center text-gray-300">
          {selectedUser.bio}
        </p>

      </div>

      <hr className="border-[#ffffff50] my-4" />

      <div className="px-5 text-xs">
        <p className="text-gray-400 uppercase tracking-widest text-[10px] mb-2">Media</p>

        {msgImages.length === 0 ? (
          <p className="text-gray-500 mt-2">No media shared yet</p>
        ) : (
          <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-3">
            {msgImages.map((url, index) => (
              <div
                key={index}
                onClick={() => window.open(url)}
                className="cursor-pointer rounded-lg overflow-hidden opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-200"
              >
                <img src={url} alt="" className="h-full w-full object-cover rounded-md" />
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={logout}
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-violet-500/30 active:scale-95 transition-all duration-200"
      >
        Logout
      </button>

    </div>
  )
}

export default RightSidebar