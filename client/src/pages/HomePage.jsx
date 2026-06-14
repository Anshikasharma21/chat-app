import React, { useContext } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import assets from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext)

  return (
    <div
      className="w-full h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${assets.bgImage})` }}
    >
      <div
        className={`backdrop-blur-xl bg-black/30 border border-gray-600 rounded-2xl overflow-hidden h-[85%] w-[85%] max-w-5xl shadow-2xl grid transition-all duration-500 ease-in-out ${
          selectedUser
            ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]'
            : 'md:grid-cols-[1fr_1fr]'
        }`}
      >
        <Sidebar />

        {selectedUser ? (
          <>
            <ChatContainer />
            <RightSidebar selectedUser={selectedUser} />
          </>
        ) : (
          <div className="flex justify-center items-center w-full max-md:hidden animate-pulse">
            <img
              src={assets.logo_big}
              alt=""
              className="w-[min(30vw,250px)] object-contain"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage