
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
// Correcting useRouter import to use next/navigation for Next.js App Router
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import AuthLayout from '@/components/auth/AuthLayout'
import { useAuth } from '@/hooks/useAuth'
import { API_CONFIG } from '@/lib/config'

const GOOGLE_LOGO = "/assets/icons/social/Logo Google.svg"
const APPLE_LOGO = "/assets/images/backgrounds/apple.png"

export default function SignInPage() {
  const router = useRouter()
  const { login, isLoading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)

  const handleGoogleLogin = () => {
    // Determine backend URL
    const backendUrl = API_CONFIG.baseURL.replace('/api/v1', '');
    window.location.href = `${backendUrl}/api/v1/auth/google/redirect`;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await login({ email, password })

    if (result.success) {
      router.push('/')
    }
  }

  return (
    <AuthLayout
      title="Welcome to Elodan"
      subtitle="sing in to get started and start creating"
    >
      {/* Social Sign In */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <button 
          type="button"
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-[125px] h-[36px] gap-2 py-2.5 bg-white border border-[#D3D3D3] rounded-3xl hover:bg-gray-50 transition-all"
        >
          <Image
            src={GOOGLE_LOGO}
            alt="Google"
            width={20}
            height={20}
            unoptimized
          />
          <span className="text-[14px] font-medium text-[#110C0C]">Google</span>
        </button>
        <button className="flex items-center justify-center bg-white w-[42px] h-[42px] border border-[#D3D3D3] rounded-full hover:bg-gray-50 transition-all">
          <Image
            src={APPLE_LOGO}
            alt="Apple"
            width={20}
            height={20}
            unoptimized
          />
        </button>
      </div>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E5E5E8]"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 bg-white text-[16px] text-[#8A8A8A]">or</span>
        </div>
      </div>

      {/* Error Messages */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <p className="text-[12px] text-red-600">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-[12px] font-normal text-[#110C0C] mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ex: myemail@gmail.com"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-[#F8F8F8] border border-[#E5E5E8] rounded-xl text-[14px] text-[#110C0C] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#110C0C]/10 focus:border-[#110C0C] transition-all disabled:opacity-50"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-[12px] font-normal text-[#110C0C] mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-[#F8F8F8] border border-[#E5E5E8] rounded-xl text-[14px] text-[#110C0C] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#110C0C]/10 focus:border-[#110C0C] transition-all disabled:opacity-50 pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A8A8A] hover:text-[#110C0C] transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Forget Password */}
        <div className="text-right">
          <Link href="/forgot-password" className="text-[14px] text-[#110C0C] hover:underline">
            Forget password?
          </Link>
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="
    w-full h-[50px] py-3
    text-white rounded-lg text-[14px] font-medium
    bg-gradient-to-r from-[#5A0A0A] to-[#110C0C]
    hover:opacity-90
    transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
  "
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      {/* Sign Up Link */}
      <p className="text-center text-[16px] text-[#110C0C] mt-6">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="
    font-medium underline
    bg-gradient-to-r from-[#5A0A0A] to-[#110C0C]
    bg-clip-text text-transparent underline
  "
        >
          Sign up
        </Link>
      </p>
    </AuthLayout>
  )
}