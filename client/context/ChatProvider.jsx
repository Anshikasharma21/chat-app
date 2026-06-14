import { useContext, useEffect, useState, useCallback } from "react"
import { ChatContext } from "./ChatContext"
import { AuthContext } from "./AuthContext"
import toast from "react-hot-toast"

export const ChatProvider = ({ children }) => {

  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [unseenMessages, setUnseenMessages] = useState({})

  const { getSocket, axios } = useContext(AuthContext)

  const getUsers = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/messages/users")
      if (data.success) {
        setUsers(data.users)
        setUnseenMessages(data.unseenMessage)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }, [axios])

  const getMessages = useCallback(async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`)
      if (data.success) {
        setMessages(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }, [axios])

  const sendMessage = useCallback(async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      )
      if (data.success) {
        setMessages((prevMessages) => [...prevMessages, data.newMessage])
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }, [axios, selectedUser])

  const subscribeToMessages = useCallback(() => {
    const socket = getSocket()
    if (!socket) return

    socket.on("newMessage", (newMessage) => {
      const senderId = newMessage.senderID || newMessage.senderId

      if (selectedUser && senderId === selectedUser._id) {
        newMessage.seen = true
        setMessages((prevMessages) => [...prevMessages, newMessage])
        axios.put(`/api/messages/mark/${newMessage._id}`)
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [senderId]: (prev[senderId] || 0) + 1,
        }))
      }
    })
  }, [selectedUser, getSocket, axios])

  const unsubscribeFromMessages = useCallback(() => {
    const socket = getSocket()
    if (socket) socket.off("newMessage")
  }, [getSocket])

  useEffect(() => {
    subscribeToMessages()
    return () => unsubscribeFromMessages()
  }, [subscribeToMessages, unsubscribeFromMessages])

  const value = {
    messages,
    users,
    selectedUser,
    unseenMessages,
    setUnseenMessages,
    getUsers,
    getMessages,
    sendMessage,
    setMessages,
    setSelectedUser,
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}