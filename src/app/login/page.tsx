'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    console.log('🔍 Login page: Starting sign in process')
    const response = await signIn(email, password)
    
    if (response.error) {
      console.log('❌ Login page: Sign in failed:', response.error)
      setError(response.error.message)
    } else {
      console.log('✅ Login page: Sign in successful, redirecting to dashboard')
      router.push('/dashboard')
    }
    
    setLoading(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    console.log('🔍 Login page: Starting sign up process')
    const response = await signUp(email, password)
    
    if (response.error) {
      console.log('❌ Login page: Sign up failed:', response.error)
      setError(response.error.message)
    } else {
      console.log('✅ Login page: Sign up successful, attempting auto login')
      
      // Auto login after successful signup
      const signInResponse = await signIn(email, password)
      if (signInResponse.error) {
        console.log('❌ Login page: Auto login after signup failed:', signInResponse.error)
        setError(`Account created but login failed: ${signInResponse.error.message}`)
      } else {
        console.log('✅ Login page: Auto login successful, redirecting to dashboard')
        router.push('/dashboard')
      }
    }
    
    setLoading(false)
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    setError('')
    setEmail('')
    setPassword('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🦛</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Hippo Study
          </h2>
          <p className="text-gray-700">
            {isSignUp ? 'Create your account' : 'Welcome back!'}
          </p>
        </div>

        <div className="rounded-lg shadow-md bg-white p-8">
          {/* Tab Navigation */}
          <div className="flex mb-6 border-b border-gray-200">
            <button
              type="button"
              onClick={() => !isSignUp && toggleMode()}
              className={`flex-1 py-2 px-4 text-center font-medium text-sm border-b-2 transition-colors ${
                !isSignUp 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => isSignUp && toggleMode()}
              className={`flex-1 py-2 px-4 text-center font-medium text-sm border-b-2 transition-colors ${
                isSignUp 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-black"
                  style={{ color: "black !important" }}
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-black"
                  style={{ color: "black !important" }}
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-md text-sm bg-red-50 text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isSignUp ? 'Creating account...' : 'Signing in...'}
                </span>
              ) : (
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={toggleMode}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {isSignUp ? 'Sign in here' : 'Create one here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
