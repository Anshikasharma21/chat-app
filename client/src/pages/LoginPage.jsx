import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {

  const [currState, setCurrState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)

  const { login } = useContext(AuthContext)

  const onSubmittedHandler = (event) => {
    event.preventDefault()
    if (currState === 'Sign up' && !isDataSubmitted) {
      setIsDataSubmitted(true)
      return
    }
    // FIX: was "Signup" (never matched) and 'singup' (typo)
    login(currState === "Sign up" ? 'signup' : 'login', { fullName, email, password, bio })
  }

  const isSignup = currState === "Sign up"
  const isLogin = currState === "Login"

  const showNameField = isSignup && !isDataSubmitted
  const showEmailPassword = !isDataSubmitted
  const showBioField = isSignup && isDataSubmitted

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>

      <div className="flex items-center gap-3">
        <img
          src={assets.logo_big}
          alt=""
          className='w-[min(30vw,250px)]'
        />
      </div>

      <form onSubmit={onSubmittedHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>

        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currState}
          {isDataSubmitted && (
            <img
              src={assets.arrow_icon}
              alt=""
              className='w-5 cursor-pointer'
              onClick={() => setIsDataSubmitted(false)}
            />
          )}
        </h2>

        {showNameField && (
          <input
            type='text'
            placeholder='Full Name'
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className='p-2 border border-gray-500 rounded-md focus:outline-none'
          />
        )}

        {showEmailPassword && (
          <>
            <input
              type="email"
              placeholder='Email Address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='p-2 border border-gray-500 rounded-md focus:outline-none'
            />
            <input
              type="password"
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='p-2 border border-gray-500 rounded-md focus:outline-none'
            />
          </>
        )}

        {showBioField && (
          <textarea
            rows={4}
            placeholder='Provide a short bio...'
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            className='p-2 border border-gray-500 rounded-md focus:outline-none'
          />
        )}

        <button
          type="submit"
          className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'
        >
          {isSignup ? "Create Account" : "Login Now"}
        </button>

        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className='flex flex-col gap-2'>
          {isSignup && (
            <p className='text-sm text-gray-600'>
              Already have an account?{" "}
              <span
                onClick={() => {
                  setCurrState("Login")
                  setIsDataSubmitted(false)
                }}
                className='font-medium text-violet-500 cursor-pointer'
              >
                Login here
              </span>
            </p>
          )}

          {isLogin && (
            <p className='text-sm text-gray-600'>
              Create an account{" "}
              <span
                onClick={() => {
                  setCurrState("Sign up")
                  setIsDataSubmitted(false)
                }}
                className='font-medium text-violet-500 cursor-pointer'
              >
                click here
              </span>
            </p>
          )}
        </div>

      </form>
    </div>
  )
}

export default LoginPage