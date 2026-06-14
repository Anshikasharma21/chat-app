import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const ProfilePage = () => {
  const { updateProfile, authUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const [selectedImg, setSelectedImg] = useState(null)
  const [previewImage, setPreviewImage] = useState(authUser?.profilePic || assets.avatar_icon)
  const [name, setName] = useState(authUser?.fullName || 'Martin Johnson')
  const [bio, setBio] = useState(authUser?.bio || 'Hi Everyone, I am using Quickchat')

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImg(file)
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedImg) {
      await updateProfile({ fullName: name, bio })
      navigate('/')
      return
    }
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
      })
    const base64Image = await toBase64(selectedImg)
    await updateProfile({ profilePic: base64Image, fullName: name, bio })
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">

      <div
        className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-500 flex items-center justify-between max-sm:flex-col-reverse rounded-lg"
        style={{ animation: 'fade-in-up 0.4s ease-out both' }}
      >

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 p-10 flex-1"
        >
          <h3
            className="text-lg"
            style={{ animation: 'fade-in-up 0.4s ease-out 0.1s both' }}
          >
            Profile details
          </h3>

          {/* IMAGE INPUT */}
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer group"
            style={{ animation: 'fade-in-up 0.4s ease-out 0.15s both' }}
          >
            <input
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
              onChange={handleImageChange}
            />
            <img
              src={previewImage}
              alt=""
              className="w-12 h-12 rounded-full object-cover ring-2 ring-violet-400/30 group-hover:ring-violet-400/70 group-hover:scale-105 transition-all duration-300"
            />
            <span className="group-hover:text-violet-300 transition-colors duration-200">
              Upload Profile image
            </span>
          </label>

          {/* NAME */}
          <input
            type="text"
            required
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border border-gray-500 rounded-md bg-transparent outline-none focus:border-violet-400 transition-colors duration-200"
            style={{ animation: 'fade-in-up 0.4s ease-out 0.2s both' }}
          />

          {/* BIO */}
          <textarea
            rows={4}
            required
            placeholder="Write profile bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="p-2 border border-gray-500 rounded-md bg-transparent outline-none focus:border-violet-400 transition-colors duration-200 resize-none"
            style={{ animation: 'fade-in-up 0.4s ease-out 0.25s both' }}
          />

          {/* BUTTON */}
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full hover:scale-105 hover:shadow-lg hover:shadow-violet-500/30 active:scale-95 transition-all duration-200"
            style={{ animation: 'fade-in-up 0.4s ease-out 0.3s both' }}
          >
            Save
          </button>
        </form>

        {/* RIGHT SIDE — PREVIEW */}
        <div
          className="flex justify-center items-center p-5"
          style={{ animation: 'fade-in-up 0.4s ease-out 0.2s both' }}
        >
          <img
            src={previewImage}
            alt=""
            className="w-44 h-44 rounded-full object-cover border-4 border-purple-500 hover:scale-105 hover:border-violet-400 transition-all duration-300 shadow-lg shadow-violet-500/20"
          />
        </div>

      </div>
    </div>
  )
}

export default ProfilePage